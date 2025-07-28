'use client';
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import DropZone from '@/components/DropZone/DropZone';
import EmailField from '@/components/EmailField/EmailField';
import {
  useEmailSendMutation,
  useTempFileUploadMutation,
} from '@/services/emailService';
import { Attachment } from '@/services/emailService';
import { EmailData } from '@/types/email';

export default function EmailSendPage() {
  const sendEmailMutation = useEmailSendMutation();
  const tempFileUploadMutation = useTempFileUploadMutation();

  const [emailData, setEmailData] = React.useState<EmailData>({
    to: [''],
    cc: [''],
    bcc: [''],
    subject: '',
    content: '',
    attachments: [],
    isHtml: false,
  });
  const [showCc, setShowCc] = React.useState(true);
  const [showBcc, setShowBcc] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [editingIndex, setEditingIndex] = React.useState<{
    field: 'to' | 'cc' | 'bcc';
    index: number;
  } | null>(null);

  const handleEmailChange = (
    field: 'to' | 'cc' | 'bcc',
    index: number,
    value: string,
  ) => {
    const newEmails = [...emailData[field]];
    newEmails[index] = value;
    setEmailData({ ...emailData, [field]: newEmails });
  };

  const handleEmailKeyDown = (
    field: 'to' | 'cc' | 'bcc',
    index: number,
    e: React.KeyboardEvent,
  ) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      const value = emailData[field][index].trim();
      if (value && isValidEmail(value)) {
        // 편집 모드 종료
        setEditingIndex(null);
        // 새 입력 필드 추가
        const newEmails = [...emailData[field]];
        newEmails.push('');
        setEmailData({ ...emailData, [field]: newEmails });
        // 새 필드를 편집 모드로 설정
        setEditingIndex({ field, index: newEmails.length - 1 });
      }
    } else if (e.key === 'Escape') {
      // 편집 모드 취소
      setEditingIndex(null);
    }
  };

  const handleChipClick = (field: 'to' | 'cc' | 'bcc', index: number) => {
    if (index === -1) {
      // 편집 모드 종료
      setEditingIndex(null);
    } else {
      setEditingIndex({ field, index });
    }
  };

  const handleChipDelete = (field: 'to' | 'cc' | 'bcc', index: number) => {
    const newEmails = emailData[field].filter((_, i) => i !== index);
    setEmailData({ ...emailData, [field]: newEmails });

    // 편집 중인 필드가 삭제되면 편집 모드 종료
    if (editingIndex?.field === field && editingIndex?.index === index) {
      setEditingIndex(null);
    }

    // 참조나 숨은 참조에서 모든 이메일을 삭제하면 해당 필드를 숨김
    if (field === 'cc' && newEmails.length === 0) {
      setShowCc(false);
    }
    if (field === 'bcc' && newEmails.length === 0) {
      setShowBcc(false);
    }
  };

  const handleAddEmail = (field: 'to' | 'cc' | 'bcc') => {
    const newEmails = [...emailData[field], ''];
    setEmailData({ ...emailData, [field]: newEmails });
    // 새로 추가된 필드를 편집 모드로 설정
    setEditingIndex({ field, index: newEmails.length - 1 });
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = emailData.attachments.filter((_, i) => i !== index);
    setEmailData({ ...emailData, attachments: newAttachments });
  };

  const handleDropZoneFilesChange = (files: File[]) => {
    setEmailData({ ...emailData, attachments: files });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 유효성 검사
    const validToEmails = emailData.to.filter((email) => email.trim() !== '');
    if (validToEmails.length === 0) {
      toast.error('수신자를 입력해주세요.');
      return;
    }

    if (!emailData.subject.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!emailData.content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    try {
      // 1단계: 파일 업로드
      const attachments: Attachment[] = [];

      if (emailData.attachments.length > 0) {
        for (const file of emailData.attachments) {
          try {
            const uploadResponse =
              await tempFileUploadMutation.mutateAsync(file);

            // 백엔드 응답 체크
            if (!uploadResponse.data.url) {
              toast.error(
                uploadResponse.data.name || '파일 업로드에 실패했습니다.',
              );
              return;
            }

            // Attachment 객체 구성
            attachments.push({
              name: uploadResponse.data.name,
              contentType: uploadResponse.data.contentType || file.type,
              url: uploadResponse.data.url,
            });
          } catch (error) {
            toast.error(`${file.name} 파일 업로드에 실패했습니다.`);
            return;
          }
        }
      }

      // 2단계: 이메일 전송
      const emailRequest = {
        to: validToEmails,
        subject: emailData.subject.trim(),
        text: emailData.content.trim(),
        isHtml: emailData.isHtml,
        ...(emailData.cc.filter((email) => email.trim() !== '').length > 0 && {
          cc: emailData.cc.filter((email) => email.trim() !== ''),
        }),
        ...(emailData.bcc.filter((email) => email.trim() !== '').length > 0 && {
          bcc: emailData.bcc.filter((email) => email.trim() !== ''),
        }),
        ...(attachments.length > 0 && { attachments }),
      };

      await sendEmailMutation.mutateAsync(emailRequest);

      // 성공 시 폼 초기화
      setEmailData({
        to: [''],
        cc: [''],
        bcc: [''],
        subject: '',
        content: '',
        attachments: [],
        isHtml: false,
      });

      toast.success('이메일이 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('이메일 전송 오류:', error);
      toast.error('이메일 전송에 실패했습니다.');
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            새 메시지
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              disabled={
                !emailData.to[0]?.trim() ||
                !emailData.subject.trim() ||
                !emailData.content.trim() ||
                sendEmailMutation.isPending
              }
              onClick={(e) => {
                e.preventDefault();
                const form = document.querySelector('form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { bubbles: true }));
                }
              }}
            >
              {sendEmailMutation.isPending ? '전송 중...' : '보내기'}
            </Button>
            <Tooltip title="더보기">
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* 이메일 폼 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Paper
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {/* 수신자 필드 */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack spacing={2}>
                {/* 받는 사람 */}
                <EmailField
                  label="받는 사람"
                  emails={emailData.to}
                  editingIndex={editingIndex}
                  field="to"
                  onEmailChange={handleEmailChange}
                  onEmailKeyDown={handleEmailKeyDown}
                  onChipClick={handleChipClick}
                  onChipDelete={handleChipDelete}
                  onAddEmail={handleAddEmail}
                />

                {/* 참조 */}
                <EmailField
                  label="참조"
                  emails={emailData.cc}
                  editingIndex={editingIndex}
                  field="cc"
                  onEmailChange={handleEmailChange}
                  onEmailKeyDown={handleEmailKeyDown}
                  onChipClick={handleChipClick}
                  onChipDelete={handleChipDelete}
                  onAddEmail={handleAddEmail}
                />

                {/* 숨은 참조 */}
                <EmailField
                  label="숨은 참조"
                  emails={emailData.bcc}
                  editingIndex={editingIndex}
                  field="bcc"
                  onEmailChange={handleEmailChange}
                  onEmailKeyDown={handleEmailKeyDown}
                  onChipClick={handleChipClick}
                  onChipDelete={handleChipDelete}
                  onAddEmail={handleAddEmail}
                />
              </Stack>
            </Box>

            {/* 제목 필드 */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="제목"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>

            {/* 첨부파일 */}
            {emailData.attachments.length > 0 && (
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  첨부파일 ({emailData.attachments.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {emailData.attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={`${file.name} (${formatFileSize(file.size)})`}
                      onDelete={() => handleRemoveAttachment(index)}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* 드롭존 */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <DropZone
                onFilesChange={handleDropZoneFilesChange}
                showFileList={false}
                width="100%"
              />
            </Box>

            {/* 본문 */}
            <Box sx={{ flex: 1, p: 2 }}>
              <TextField
                fullWidth
                multiline
                placeholder="메시지를 입력하세요..."
                value={emailData.content}
                onChange={(e) =>
                  setEmailData({ ...emailData, content: e.target.value })
                }
                variant="outlined"
                sx={{
                  height: '100%',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    overflow: 'auto',
                  },
                }}
              />
            </Box>
          </form>
        </Paper>
      </Box>

      {/* 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>임시저장</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>삭제</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
