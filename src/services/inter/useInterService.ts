import { useDialog } from '@/components/providers/DialogProvider';
import { useApiContext } from '@/components/providers/ApiProvider';
import { handleApiError } from '@/utils/handleApiError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  extractFilenameFromDisposition,
  triggerBlobDownload,
} from '@/utils/fileDownloadHelper';
import { ATTACH_API } from '@/constants/api';
import { useApi } from '@/hooks/useApi';

// 타입 정의
export interface AttachFileResponse {
  fileId: number;
  attachId: number;
  originalFileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface AttachResponse {
  attachId: number;
  attachName: string;
  creatorId: string;
  createdAt: string;
}

interface PageResponse {
  content: AttachResponse[];
  totalElements: number;
  size: number;
  number: number;
}

interface UploadFilesProps {
  files: File[];
  data: Record<string, any>;
}

/**
 * 인터페이스 서비스 통합 훅
 *
 * FTP 업로드, 파일 관리 등 인터페이스 관련 모든 기능을 제공합니다.
 *
 * @returns 인터페이스 관련 모든 훅과 함수들을 포함한 객체
 */
export function useInterService() {
  const api = useApiContext();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  // FTP 파일 업로드
  const useFtpUploadMutation = () => {
    const uploadFiles = ({ files, data }: UploadFilesProps) => {
      return api.upload(ATTACH_API.UPLOAD, files, data);
    };

    return useMutation({
      mutationFn: uploadFiles,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attach-list'] });
        showAlert('성공', '업로드 성공!', {
          useSweetAlert: true,
          sweetAlertIcon: 'success',
        });
      },
      onError: (error: AxiosError) => {
        handleApiError(error, showAlert, '오류', '업로드 실패');
      },
    });
  };

  // 첨부 파일 추가
  const useAttachFileAddMutation = (attachId: number) => {
    const addFiles = (files: File[]) => {
      return api.upload(ATTACH_API.ADD_FILES(attachId), files);
    };

    return useMutation({
      mutationFn: addFiles,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['attach-files', attachId] });
        showAlert('성공', '파일 추가 성공!', {
          useSweetAlert: true,
          sweetAlertIcon: 'success',
        });
      },
      onError: (error: AxiosError) => {
        handleApiError(error, showAlert, '오류', '파일 추가 실패');
      },
    });
  };

  // 첨부 목록 조회
  const useAttachList = (page: number, size: number) => {
    const param = { page, size };

    const getFiles = async ({ page, size }: { page: number; size: number }) => {
      const res = await api.get(ATTACH_API.GET_ALL_ATTACHS, { page, size });
      return res.data;
    };

    return useQuery<PageResponse, Error>({
      queryKey: ['attach-list', page, size],
      queryFn: () => getFiles(param),
      enabled: api.status === 'authenticated',
      refetchOnWindowFocus: true,
      staleTime: 5000,
    });
  };

  // 첨부 파일 조회
  const useAttachFiles = (attachId: number) => {
    const getFiles = async (
      attachId: number,
    ): Promise<AttachFileResponse[]> => {
      const res = await api.get(ATTACH_API.GET_FILES(attachId));
      return res.data;
    };

    return useQuery<AttachFileResponse[], Error>({
      queryKey: ['attach-files', attachId],
      queryFn: () => getFiles(attachId),
      enabled: api.status === 'authenticated',
      refetchOnWindowFocus: true,
      staleTime: 60 * 1000,
    });
  };

  // 파일 다운로드
  const downloadFile = async (
    api: ReturnType<typeof useApi>,
    fileId: number,
  ) => {
    const res = await api.download(ATTACH_API.DOWNLOAD(fileId));
    const filename = extractFilenameFromDisposition(
      res.headers['content-disposition'],
    );
    triggerBlobDownload(res.data, filename);
  };

  // 번들 다운로드
  const downloadBundle = async (
    api: ReturnType<typeof useApi>,
    attachId: number,
  ) => {
    const res = await api.download(ATTACH_API.DOWNLOAD_BUNDLE(attachId));
    const filename = extractFilenameFromDisposition(
      res.headers['content-disposition'],
    );
    triggerBlobDownload(res.data, filename);
  };

  return {
    // 훅들
    useFtpUploadMutation,
    useAttachFileAddMutation,
    useAttachList,
    useAttachFiles,

    // 함수들
    downloadFile,
    downloadBundle,
  };
}
