/**
 * Inter 서비스 export 파일
 *
 * 이 파일은 inter 폴더의 모든 서비스를 export하는 중앙 집중식 진입점입니다.
 * FTP 업로드, 파일 관리 등 인터페이스 관련 모든 기능을 제공합니다.
 *
 * @description
 * - useInterService: 인터페이스 관련 모든 기능을 통합한 훅
 *   - FTP 파일 업로드
 *   - 첨부 파일 추가
 *   - 첨부 목록/파일 조회
 *   - 파일/번들 다운로드
 *
 * @example
 * // 인터페이스 서비스 사용
 * import { useInterService } from '@/services/inter';
 * const { useFtpUploadMutation, useAttachList, downloadFile } = useInterService();
 *
 * // FTP 업로드
 * const uploadMutation = useFtpUploadMutation();
 * uploadMutation.mutate({ files: [file], data: { attachName: '테스트' } });
 *
 * // 첨부 목록 조회
 * const { data: attachList } = useAttachList(1, 10);
 *
 * // 파일 다운로드
 * await downloadFile(api, fileId);
 */

export { useInterService } from './useInterService';
export type { AttachFileResponse } from './useInterService';
