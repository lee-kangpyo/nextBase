// src/services/ftpService.ts
import { useDialog } from '@/components/providers/DialogProvider';
import { useApi } from '@/hooks/useApi';
import { handleApiError } from '@/utils/handleApiError';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface UploadFilesProps {
  files: File[];
  data: Record<string, any>;
}

export function useFtpUploadMutation() {
  const api = useApi();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  const uploadFiles = ({ files, data }: UploadFilesProps) => {
    return api.upload('/interface/ftp/upload', files, data);
  };

  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ftpFileList'] });
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
