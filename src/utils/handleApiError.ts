import { AxiosError } from 'axios';

/**
 * API 에러를 상태코드에 따라 분기 처리하여 사용자에게 얼럿(Alert)을 띄우는 유틸 함수.
 * 401은 아무 동작도 하지 않음 (useApi에서 처리)
 * 그 외 에러는 showAlert로 얼럿
 * 서비스/컴포넌트에서 직접 처리하고 싶은 상태코드는 onError에서 분기 후 return
 * @param error - AxiosError 객체
 * @param showAlert - 얼럿을 띄우는 함수
 * @param title - 얼럿 제목
 * @param fallbackMessage - 얼럿 메시지 (기본값)
 * @example
 * // 서비스/컴포넌트에서 사용 예시
 * onError: (error: AxiosError) => {
 *   if (error.response?.status === 403) {
 *     showAlert('권한 없음', '이 작업을 수행할 권한이 없습니다.', { useSweetAlert: true, sweetAlertIcon: 'warning' });
 *     return;
 *   }
 *   handleApiError(error, showAlert, '오류', '업로드 실패');
 * }
 */
export function handleApiError(
  error: AxiosError,
  showAlert: (title: string, message: string, options?: any) => void,
  title = '오류',
  fallbackMessage = '요청중 알수없는 오류가 발생했습니다.',
) {
  if (error.response?.status === 401) {
    error.message = '세션이 만료되었습니다.';
    return;
  }
  // 그 외 에러만 Alert
  showAlert(title, fallbackMessage, {
    useSweetAlert: true,
    sweetAlertIcon: 'error',
  });
}
