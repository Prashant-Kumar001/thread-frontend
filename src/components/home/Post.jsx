import { Stack, Box, useMediaQuery, useTheme } from "@mui/material";
import PostAvatarThreadBar from "./post/PostAvatarThreadBar";
import PostBody from "./post/PostBody";
import PostToolbar from "./post/PostToolbar";
import PostReplyBox from "./post/PostReplyBox";
import { useThreadActions } from "../../context/ThreadActionsContext";
import { useSelector } from "react-redux";
import { BiMenu } from "react-icons/bi";

const Post = ({
  thread,
  variant = "full",
  showReplyInput = variant === "full",
  showToolbar = variant !== "compact",
  showThreadBar = variant !== "compact",
  sx = {},
}) => {
  const { threadLike, threadReplies, threadRetweet, threadReplyLike, deleteThread, send } =
    useThreadActions() || {};
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!thread) return null;

  const isRepost =
    thread.threadType === "repost" && Boolean(thread.originalThread);
  const isQuote =
    thread.threadType === "quote" && Boolean(thread.originalThread);

  const {
    _id,
    author: threadAuthor = {},
    likeCount = 0,
    replyCount = 0,
    repostCount = 0,
    replies = [],
    likes = [],
    reposts = [],
    quoteContent = "",
  } = thread;

  const displayThread = isRepost || isQuote ? thread.originalThread : thread;

  const {
    author: originalThreadAuthor = {},
    content = "",
    media = [],
    createdAt,
  } = displayThread;

  return (
    <Stack
      direction="row"
      spacing={isMobile ? 0.5 : 1}
      py={isMobile ? 1 : variant === "reply" ? 1 : 1.5}
      px={isMobile ? 1.5 : 2}
      gap={isMobile ? 0.5 : 1}
      borderBottom={`1px solid ${theme.palette.divider}`}
      role="article"
    >
      {showThreadBar && !isMobile && (
        <PostAvatarThreadBar
          user={user}
          author={threadAuthor}
          replies={replies.map((r) => r.author || {})}
          isOwner={user?.id === threadAuthor?._id}
          isReply={variant === "reply"}
        />
      )}

      <Stack flex={1} spacing={0.5}>
        <PostBody
          user={user}
          author={threadAuthor}
          originalThreadAuthor={originalThreadAuthor}
          reposter={isRepost || isQuote ? threadAuthor : null}
          text={content}
          quoteText={isQuote ? quoteContent : ""}
          media={media}
          createdAt={createdAt}
          threadId={_id}
          isRepost={isRepost}
          isQuote={isQuote}
          onDelete={deleteThread}
        />

        {showToolbar && (
          <PostToolbar
            liked={likes?.some((like) => like._id === user?.id)}
            likesCount={likeCount}
            repliesCount={replyCount}
            repostCount={repostCount}
            onLike={(_id) => threadLike(_id)}
            onReplyLike={(_id) => threadReplyLike(_id)}
            onRetweet={(_id) => threadRetweet(_id)}
            onSend={(sender, _id) => send(sender, _id)}
            disabled={variant !== "full" && variant !== "reply"}
            replies={replies}
            id={_id}
            user={user}
          />
        )}

        {showReplyInput && (
          <Box mt={1}>
            <PostReplyBox
              onSend={(text) => threadReplies(_id, text, "reply")}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Post;
