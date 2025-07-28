import { useMutation, useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/utils/handleApiError';
import { AxiosError } from 'axios';
import { useDialog } from '@/components/providers/DialogProvider';

export function useAdminUserList() {
  const api = useApi();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['admin-user-list'],
    enabled: api.status === 'authenticated',
    queryFn: async () => {
      const res = await api.get('/admin/userList');
      return res.data;
    },
  });
}
