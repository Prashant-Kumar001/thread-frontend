import { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { FiMessageCircle } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { formatRelativeTime } from "../utils/helper";
import {
  useLikeReplyMutation,
  useLikeThreadMutation,
} from "../../redux/services/api/thread";

const ThreadCard = ({ thread, onReplyClick, isReply = false }) => {
  const { user } = useSelector((state) => state.auth);
  const [likeThread] = useLikeThreadMutation();
  const [likeReply] = useLikeReplyMutation();
  const [optimisticLikes, setOptimisticLikes] = useState(
    thread?.likeCount || 0
  );
  const [liked, setLiked] = useState(thread?.likes?.includes(user?.id));

  const isQuote = thread?.threadType === "quote" && thread?.originalThread;
  const isRepost = thread?.threadType === "repost" && thread?.originalThread;
  const hasOriginal = isQuote || isRepost;
  const displayThread = hasOriginal ? thread.originalThread : thread;

  useEffect(() => {
    setLiked(thread?.likes?.includes(user?.id));
    setOptimisticLikes(thread?.likeCount);
  }, [thread]);

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setOptimisticLikes((prev) => (liked ? prev - 1 : prev + 1));
      isReply
        ? await likeReply(thread._id).unwrap()
        : await likeThread(thread._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box display="flex" gap={2} mb={3}>
      <Avatar src={thread.author?.avatar?.secure_url} />
      <Box flex={1}>
        <Typography fontWeight="bold">@{thread.author?.username}</Typography>
        {isQuote && thread.quoteContent && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            {thread.quoteContent}
          </Typography>
        )}
        <Typography variant="body1" mt={0.5}>
          {displayThread?.content}
        </Typography>
        {displayThread?.media?.length > 0 && (
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {displayThread.media.map((media, i) => (
              <img
                key={i}
                src={media.secure_url}
                alt="media"
                style={{ width: 120, borderRadius: 8 }}
              />
            ))}
          </Box>
        )}


        <Box display="flex" gap={2} mt={1} alignItems="center">
          <Tooltip title="Like">
            <IconButton onClick={handleLike} size="small">
              {liked ? (
                <FaHeart size={16} color="red" />
              ) : (
                <FaRegHeart size={16} />
              )}
              &nbsp;{optimisticLikes}
            </IconButton>
          </Tooltip>

          {!isReply && (
            <Tooltip title="Reply">
              <IconButton onClick={() => onReplyClick(thread)} size="small">
                <FiMessageCircle /> &nbsp;{thread.replyCount}
              </IconButton>
            </Tooltip>
          )}

          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(thread.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ThreadCard;
