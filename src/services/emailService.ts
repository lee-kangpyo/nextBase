import { useMutation } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { useDialog } from '@/components/providers/DialogProvider';
import { handleApiError } from '@/utils/handleApiError';
import { AxiosError } from 'axios';

// 백엔드 DTO 인터페이스
interface TempFileResponse {
  url: string | null;
  name: string;
  contentType: string | null;
}

export interface Attachment {
  name: string;
  contentType: string;
  url?: string;
  content?: Uint8Array;
}

interface EmailRequest {
  to: string[];
  subject: string;
  text: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
  attachments?: Attachment[];
}

// 임시 파일 업로드 API
export function useTempFileUploadMutation() {
  const api = useApi();
  const { showAlert } = useDialog();

  const uploadTempFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/temp-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return useMutation({
    mutationFn: uploadTempFile,
    onSuccess: (response) => {
      // 성공 시 별도 알림 없음 (이메일 전송 시에만 알림)
      console.log('임시 파일 업로드 성공:', response.data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, showAlert, '오류', '파일 업로드 실패');
    },
  });
}

// 이메일 전송 API (JSON 방식)
export function useEmailSendMutation() {
  const api = useApi();
  const { showAlert } = useDialog();

  const sendEmail = (emailRequest: EmailRequest) => {
    return api.post('/email/send', emailRequest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      showAlert('성공', '이메일이 성공적으로 전송되었습니다.', {
        useSweetAlert: true,
        sweetAlertIcon: 'success',
      });
    },
    onError: (error: AxiosError) => {
      handleApiError(error, showAlert, '오류', '이메일 전송 실패');
    },
  });
}

// 기존 파일 업로드 API (다른 용도로 사용 가능)
export function useFileUploadMutation() {
  const api = useApi();
  const { showAlert } = useDialog();

  const uploadFiles = (files: File[]) => {
    return api.upload('/attach/upload', files, {
      attachName: '이메일 첨부파일',
    });
  };

  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (response) => {
      console.log('파일 업로드 성공:', response.data);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, showAlert, '오류', '파일 업로드 실패');
    },
  });
}
