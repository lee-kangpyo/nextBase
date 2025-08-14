import { useMutation } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { useDialog } from '@/components/providers/DialogProvider';
import { handleApiError } from '@/utils/handleApiError';
import { AxiosError } from 'axios';
import { EMAIL_API, ATTACH_API } from '@/constants/api';

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

/**
 * 이메일 서비스 통합 훅
 *
 * 이메일 전송, 파일 업로드 등 이메일 관련 모든 기능을 제공합니다.
 *
 * @returns 이메일 관련 모든 훅과 함수들을 포함한 객체
 */
export function useEmailService() {
  const api = useApi();
  const { showAlert } = useDialog();

  // 임시 파일 업로드 API
  const useTempFileUploadMutation = () => {
    const uploadTempFile = (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return api.post(EMAIL_API.TEMP_FILE_UPLOAD, formData, {
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
  };

  // 이메일 전송 API (JSON 방식)
  const useEmailSendMutation = () => {
    const sendEmail = (emailRequest: EmailRequest) => {
      return api.post(EMAIL_API.SEND, emailRequest, {
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
  };

  // 기존 파일 업로드 API (다른 용도로 사용 가능)
  const useFileUploadMutation = () => {
    const uploadFiles = (files: File[]) => {
      return api.upload(ATTACH_API.UPLOAD, files, {
        attachName: '이메일 첨부파일',
      });
    };

    return useMutation({
      mutationFn: uploadFiles,
      onSuccess: (response) => {
        console.log('파일 업로드 성공:', response.data);
        showAlert('성공', '파일이 성공적으로 업로드되었습니다.', {
          useSweetAlert: true,
          sweetAlertIcon: 'success',
        });
      },
      onError: (error: AxiosError) => {
        handleApiError(error, showAlert, '오류', '파일 업로드 실패');
      },
    });
  };

  // 이메일 전송 API (FormData 방식)
  const useEmailSendFormDataMutation = () => {
    const sendEmailFormData = (emailRequest: EmailRequest) => {
      const formData = new FormData();
      formData.append('to', JSON.stringify(emailRequest.to));
      formData.append('subject', emailRequest.subject);
      formData.append('text', emailRequest.text);

      if (emailRequest.cc) {
        formData.append('cc', JSON.stringify(emailRequest.cc));
      }
      if (emailRequest.bcc) {
        formData.append('bcc', JSON.stringify(emailRequest.bcc));
      }
      if (emailRequest.isHtml) {
        formData.append('isHtml', emailRequest.isHtml.toString());
      }

      if (emailRequest.attachments) {
        emailRequest.attachments.forEach((attachment, index) => {
          if (attachment.content) {
            const blob = new Blob([attachment.content], {
              type: attachment.contentType,
            });
            formData.append(`attachments`, blob, attachment.name);
          }
        });
      }

      return api.post(EMAIL_API.SEND, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    };

    return useMutation({
      mutationFn: sendEmailFormData,
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
  };

  return {
    // 훅들
    useTempFileUploadMutation,
    useEmailSendMutation,
    useFileUploadMutation,
    useEmailSendFormDataMutation,
  };
}
