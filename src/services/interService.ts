// src/services/ftpService.ts
import { useDialog } from '@/components/providers/DialogProvider';
import { useApi } from '@/hooks/useApi';
import { handleApiError } from '@/utils/handleApiError';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  extractFilenameFromDisposition,
  triggerBlobDownload,
} from '@/utils/fileDownloadHelper';

export function useFtpUploadMutation() {
  const api = useApi();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  const uploadFiles = ({ files, data }: UploadFilesProps) => {
    return api.upload('/attach/upload', files, data);
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
}

export function useAttachFileAddMutation(attachId: number) {
  const api = useApi();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  const addFiles = (files: File[]) => {
    return api.upload(`/attach/${attachId}/files`, files);
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
}

export function useAttachList(page: number, size: number) {
  const api = useApi();
  const param = { page, size };

  const getFiles = async ({ page, size }: { page: number; size: number }) => {
    const res = await api.get('/attach/all-attaches', { page, size });
    return res.data;
  };

  return useQuery<PageResponse, Error>({
    queryKey: ['attach-list', page, size],
    queryFn: () => getFiles(param),
    enabled: api.status === 'authenticated',
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}

export function useAttachFiles(attachId: number) {
  const api = useApi();
  debugger;
  const getFiles = async (attachId: number): Promise<AttachFileResponse[]> => {
    const res = await api.get(`/attach/${attachId}/files`);
    return res.data;
  };

  return useQuery<AttachFileResponse[], Error>({
    queryKey: ['attach-files', attachId],
    queryFn: () => getFiles(attachId),
    enabled: api.status === 'authenticated',
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
  });
}

export async function downloadFile(
  api: ReturnType<typeof useApi>,
  fileId: number,
) {
  const res = await api.download(`/attach/download/${fileId}`);
  const blob = new Blob([res.data]);
  const disposition = res.headers['content-disposition'];
  const filename = extractFilenameFromDisposition(
    disposition,
    'downloaded_file',
  );
  triggerBlobDownload(blob, filename);
}

export async function downloadBundle(
  api: ReturnType<typeof useApi>,
  attachId: number,
) {
  const res = await api.download(`/attach/download-bundle/${attachId}`);
  const blob = new Blob([res.data]);
  // const disposition = res.headers['content-disposition'];
  // const filename = extractFilenameFromDisposition(disposition, 'bundle.zip');
  triggerBlobDownload(blob, '첨부파일.zip');
}

export interface AttachFileResponse {
  fileId: number;
  attachId: number;
  originalFileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface UploadFilesProps {
  files: File[];
  data: Record<string, any>;
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
