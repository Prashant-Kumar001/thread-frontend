import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  CircularProgress,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useGetThreadRepliesQuery } from "../../redux/services/api/thread";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

const ThreadRepliesModal = ({ open, onClose, threadId, onLike, user }) => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [allReplies, setAllReplies] = useState([]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetThreadRepliesQuery(
    { id: threadId, page, limit: 20 },
    { skip: !threadId || !open }
  );

  useEffect(() => {
    if (data?.replies?.length) {
      setAllReplies((prev) => {
        const existingIds = new Set(prev.map((r) => r._id));
        const newReplies = data.replies.filter((r) => !existingIds.has(r._id));
        return page === 1 ? data.replies : [...prev, ...newReplies];
      });
    }
  }, [data, page]);

  const handleLike = (replyId) => onLike(replyId);

  const handleLoadMore = () => {
    if (!isFetching && data?.currentPage < data?.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    setAllReplies([]);
    setPage(1);
    onClose();
  };

  const navigateToProfile = useCallback((username) => {
    if (username) {
      window.location.href = `/profile/${username}`;
    }
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="replies-modal-title"
      disableScrollLock
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: 600 },
          maxHeight: "80vh",
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          overflowY: "auto",
        }}
        role="dialog"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="replies-modal-title" fontWeight={600} fontSize={18}>
            Replies
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: theme.palette.text.primary }}>
            <IoCloseSharp size={20} />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2, bgcolor: theme.palette.divider }} />

        {isLoading && page === 1 ? (
          <Stack alignItems="center" mt={4}>
            <CircularProgress size={24} />
          </Stack>
        ) : isError ? (
          <Typography fontSize={14} color="error.main" textAlign="center">
            {error?.message || "Error loading replies"}
          </Typography>
        ) : allReplies.length === 0 ? (
          <Typography fontSize={14} color="text.secondary" textAlign="center">
            No replies yet.
          </Typography>
        ) : (
          <>
            {allReplies.map((reply) => (
              <Box key={reply._id} mb={2}>
                <Stack direction="row" spacing={2}>
                  <Tooltip title={`@${reply.author?.username || "Unknown"}`} arrow>
                    <Avatar
                      src={reply.author?.avatar?.secure_url || ""}
                      alt={reply.author?.username || "Anonymous"}
                      sx={{ width: 40, height: 40, cursor: "pointer" }}
                      onClick={() => navigateToProfile(reply.author?.username)}
                    />
                  </Tooltip>
                  <Box flexGrow={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography fontWeight={500} fontSize={14}>
                        {reply.author?.username || "Anonymous"}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </Typography>
                    </Stack>
                    <Typography fontSize={14} mt={0.5} mb={1}>
                      {reply.content}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Tooltip title="Like" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleLike(reply._id)}
                          sx={{ p: 0.5 }}
                        >
                          {reply?.likes?.includes(user?.id) ? (
                            <FaHeart size={16} color="red" />
                          ) : (
                            <FaRegHeart size={16} color={theme.palette.text.primary} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Typography fontSize={12} color="text.secondary">
                        {reply?.likeCount || 0}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                <Divider sx={{ mt: 2, bgcolor: theme.palette.divider }} />
              </Box>
            ))}

            {data?.currentPage < data?.totalPages && (
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  sx={{
                    textTransform: "none",
                    color: theme.palette.primary.contrastText,
                    borderColor: theme.palette.primary.contrastText,
                    "&:hover": {
                      bgcolor: theme.palette.primary.contrastText,
                      color: theme.palette.background.paper,
                    },
                    "&:disabled": {
                      bgcolor: "grey.800",
                      color: "grey.500",
                      borderColor: "grey.800",
                    },
                  }}
                >
                  {isFetching ? "Loading..." : "Load More Replies"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ThreadRepliesModal;
