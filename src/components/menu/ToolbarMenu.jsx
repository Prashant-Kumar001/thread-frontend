import React from 'react';
import {
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Box,
  Divider,
} from '@mui/material';
import { FaRetweet, FaQuoteRight } from 'react-icons/fa';

const ToolbarMenu = ({ threadId, anchorEl, open, onClose, onRepost, onQuote }) => {
  const theme = useTheme();

  return (
    <Menu
      id="toolbar-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 4,
        sx: {
          borderRadius: 2,
          minWidth: 180,
          py: 1,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.menuBackground
              : '#fff',
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 0 10px rgba(255,255,255,0.2)'
              : '0 px 10px rgba(0,0,0,0.1)',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem
        onClick={() => {
          onClose();
          onRepost?.(threadId);
        }}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 1,
          gap: 1.5,
          display: 'flex',
          alignItems: 'center',
          transition: '0.2s ease',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
          '&:hover .icon': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Box
          className="icon"
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          <FaRetweet size={16} color={theme.palette.success.main} />
        </Box>
        <Typography fontSize={14} fontWeight={500}>
          Repost
        </Typography>
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem
        onClick={() => {
          onClose();
          onQuote?.(threadId);
        }}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 1,
          gap: 1.5,
          display: 'flex',
          alignItems: 'center',
          transition: '0.2s ease',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
          '&:hover .icon': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Box
          className="icon"
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          <FaQuoteRight size={16} color={theme.palette.info.main} />
        </Box>
        <Typography fontSize={14} fontWeight={500}>
          Quote
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default ToolbarMenu;
