/**
 * Email 서비스 export 파일
 *
 * 이 파일은 email 폴더의 모든 서비스를 export하는 중앙 집중식 진입점입니다.
 * 이메일 전송, 파일 업로드 등 이메일 관련 모든 기능을 제공합니다.
 *
 * @description
 * - useEmailService: 이메일 관련 모든 기능을 통합한 훅
 *   - 임시 파일 업로드
 *   - 이메일 전송 (JSON/FormData)
 *   - 파일 업로드
 *
 * @example
 * // 이메일 서비스 사용
 * import { useEmailService } from '@/services/email';
 * const { useEmailSendMutation, useTempFileUploadMutation } = useEmailService();
 *
 * // 이메일 전송
 * const emailMutation = useEmailSendMutation();
 * emailMutation.mutate({ to: ['test@example.com'], subject: '제목', text: '내용' });
 *
 * // 파일 업로드
 * const fileMutation = useTempFileUploadMutation();
 * fileMutation.mutate(file);
 */

export { useEmailService } from './useEmailService';
export type { Attachment } from './useEmailService';
