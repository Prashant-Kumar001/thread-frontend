import {
  Box,
  IconButton,
  Typography,
  Stack,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
} from "react-icons/fa6";
import { BiRepost } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import RepliesMenu from "../ThreadReplies";
import ToolbarMenu from "../../menu/ToolbarMenu";

const PostToolbar = ({
  liked,
  likesCount,
  repliesCount,
  repostCount,
  onLike,
  onReplyLike,
  onRetweet,
  onSend,
  disabled = false,
  id,
  user,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const theme = useTheme();

  const handleCommentClick = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleRetweetClick = (e) => {
    setAnchorE2(anchorE2 ? null : e.currentTarget);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} px={1}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title={liked ? "Unlike" : "Like"} arrow>
          <IconButton
            onClick={() => onLike(id)}
            disabled={disabled}
            size="small"
            sx={{
              transition: 'all 0.2s ease',
              color: liked ? theme.palette.error.main : theme.palette.text.primary,
              '&:hover': {
                transform: 'scale(1.15)',
                color: theme.palette.error.main,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
              },
            }}
          >
            {liked ? (
              <FaHeart size={16} />
            ) : (
              <FaRegHeart size={16} />
            )}
          </IconButton>
        </Tooltip>
        <Typography fontSize={12}>{likesCount}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title="View replies" arrow>
          <IconButton
            onClick={handleCommentClick}
            disabled={disabled}
            size="small"
            sx={{
              transition: 'all 0.2s ease',
              color: theme.palette.text.primary,
              '&:hover': {
                transform: 'scale(1.15)',
                color: '#00a6ff',
                backgroundColor: 'rgba(0, 166, 255, 0.1)',
              },
            }}
          >
            <FaRegCommentDots size={16} />
          </IconButton>
        </Tooltip>
        <Typography fontSize={12}>{repliesCount}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title="Repost" arrow>
          <IconButton
            onClick={handleRetweetClick}
            disabled={disabled}
            size="small"
            sx={{
              transition: 'all 0.2s ease',
              color: theme.palette.text.primary,
              '&:hover': {
                transform: 'scale(1.15)',
                color: '#85ff4c',
                backgroundColor: 'rgba(133, 255, 76, 0.1)',
              },
            }}
          >
            <BiRepost size={18} />
          </IconButton>
        </Tooltip>
        {repostCount > 0 && (
          <Typography fontSize={12}>{repostCount}</Typography>
        )}
      </Stack>
      <Tooltip title="Send post" arrow>
        <IconButton
          onClick={() => onSend(user?.username, id)}
          disabled={disabled}
          size="small"
          sx={{
            transition: 'all 0.2s ease',
            color: theme.palette.text.primary,
            '&:hover': {
              transform: 'scale(1.15)',
              color: 'cyan',
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
            },
          }}
        >
          <IoSend size={16} />
        </IconButton>
      </Tooltip>
      {open && (
        <RepliesMenu
          open={open}
          onClose={handleCommentClick}
          threadId={id}
          onLike={onReplyLike}
          user={user}
        />
      )}
      {open2 && (
        <ToolbarMenu
          anchorEl={anchorE2}
          open={open2}
          onClose={handleRetweetClick}
          onRepost={() => onRetweet(id)}
          onQuote={() => alert("Quote not implemented yet")}
          threadId={id}
          user={user}
        />
      )}
    </Box>
  );
};

export default PostToolbar;
