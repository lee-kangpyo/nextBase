'use client';
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function EmailSendPage() {
  const [isHtml, setIsHtml] = React.useState(false);
  const [toEmails, setToEmails] = React.useState(['']);
  const [ccEmails, setCcEmails] = React.useState(['']);
  const [bccEmails, setBccEmails] = React.useState(['']);

  const handleAddEmail = (
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setEmailList([...emailList, '']);
  };

  const handleRemoveEmail = (
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    const newEmails = emailList.filter((_, i) => i !== index);
    setEmailList(newEmails);
  };

  const handleEmailChange = (
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    const newEmails = [...emailList];
    newEmails[index] = value;
    setEmailList(newEmails);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const emailData = {
      to: toEmails.filter((email) => email.trim() !== ''),
      subject: formData.get('subject') as string,
      text: formData.get('text') as string,
      isHtml: isHtml,
      cc: ccEmails.filter((email) => email.trim() !== ''),
      bcc: bccEmails.filter((email) => email.trim() !== ''),
      attachments: [],
    };

    console.log('이메일 전송 데이터:', emailData);
    // TODO: API 호출 로직 구현
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        이메일 전송
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 수신자 */}
            <Box>
              <Typography variant="h6" gutterBottom>
                수신자 *
              </Typography>
              {toEmails.map((email, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) =>
                      handleEmailChange(
                        toEmails,
                        setToEmails,
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="이메일 주소를 입력하세요"
                    size="small"
                  />
                  {toEmails.length > 1 && (
                    <IconButton
                      onClick={() =>
                        handleRemoveEmail(toEmails, setToEmails, index)
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddEmail(toEmails, setToEmails)}
                sx={{ mt: 1 }}
              >
                수신자 추가
              </Button>
            </Box>

            {/* 참조 */}
            <Box>
              <Typography variant="h6" gutterBottom>
                참조 (선택)
              </Typography>
              {ccEmails.map((email, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) =>
                      handleEmailChange(
                        ccEmails,
                        setCcEmails,
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="참조 이메일 주소를 입력하세요"
                    size="small"
                  />
                  {ccEmails.length > 1 && (
                    <IconButton
                      onClick={() =>
                        handleRemoveEmail(ccEmails, setCcEmails, index)
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddEmail(ccEmails, setCcEmails)}
                sx={{ mt: 1 }}
              >
                참조 추가
              </Button>
            </Box>

            {/* 숨은 참조 */}
            <Box>
              <Typography variant="h6" gutterBottom>
                숨은 참조 (선택)
              </Typography>
              {bccEmails.map((email, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) =>
                      handleEmailChange(
                        bccEmails,
                        setBccEmails,
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="숨은 참조 이메일 주소를 입력하세요"
                    size="small"
                  />
                  {bccEmails.length > 1 && (
                    <IconButton
                      onClick={() =>
                        handleRemoveEmail(bccEmails, setBccEmails, index)
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddEmail(bccEmails, setBccEmails)}
                sx={{ mt: 1 }}
              >
                숨은 참조 추가
              </Button>
            </Box>

            {/* 제목 */}
            <TextField
              name="subject"
              label="제목 *"
              fullWidth
              required
              placeholder="이메일 제목을 입력하세요"
            />

            {/* HTML 모드 토글 */}
            <FormControlLabel
              control={
                <Switch
                  checked={isHtml}
                  onChange={(e) => setIsHtml(e.target.checked)}
                />
              }
              label="HTML 모드"
            />

            {/* 본문 */}
            <TextField
              name="text"
              label="본문 *"
              fullWidth
              required
              multiline
              rows={8}
              placeholder={
                isHtml
                  ? '<h1>제목</h1><p>내용을 입력하세요</p>'
                  : '이메일 내용을 입력하세요'
              }
            />

            {/* 전송 버튼 */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              이메일 전송
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
