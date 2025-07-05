import {
  Box,
  TextField,
  IconButton,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const PostReplyBox = ({ onSend }) => {
  const theme = useTheme();
  const [replyText, setReplyText] = useState('');
  const maxLength = 280;
  const trimmedReply = replyText.trim();
  const replyLength = replyText.length;

  const handleSendClick = () => {
    if (trimmedReply) {
      onSend(trimmedReply);
      setReplyText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && trimmedReply) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const replyLengthColor =
    replyLength > maxLength * 0.95
      ? theme.palette.error.main
      : replyLength > maxLength * 0.8
      ? theme.palette.warning.main
      : theme.palette.text.secondary;

  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        mt: 2,
        p: 1.5,
        borderRadius: 2,
        transition: '0.2s ease',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '&:hover': {
          boxShadow: `0 0 0 2px ${theme.palette.action.hover}`,
        },
      }}
    >
      <TextField
        value={replyText}
        onChange={(e) => {
          const text = e.target.value;
          if (text.length <= maxLength) setReplyText(text);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Write a reply..."
        size="small"
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        variant="standard"
        aria-label="Reply message input"
        inputProps={{
          'aria-keyshortcuts': 'Enter',
          'aria-describedby': 'reply-char-count',
        }}
        sx={{
          bgcolor: 'transparent',
          '& .MuiInputBase-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: 'text.primary',
          },
          '& .MuiInputBase-inputMultiline': {
            padding: 0,
          },
          '& .MuiInput-underline:before, & .MuiInput-underline:after': {
            display: 'none',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <IconButton
          disabled={!trimmedReply}
          onClick={handleSendClick}
          aria-label="Send reply"
          sx={{
            color: trimmedReply ? 'primary.main' : 'text.disabled',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: trimmedReply ? 'scale(1.2)' : 'none',
              backgroundColor: trimmedReply
                ? 'rgba(0, 123, 255, 0.1)'
                : 'transparent',
            },
            p: 0.75,
          }}
        >
          <IoSend size={20} />
        </IconButton>
        <Typography
          id="reply-char-count"
          variant="caption"
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            color: replyLengthColor,
          }}
        >
          {replyLength}/{maxLength}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PostReplyBox;
