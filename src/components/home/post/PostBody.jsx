import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import PostMedia from "./PostMedia";
import { formatDistanceToNow, format } from "date-fns";
import { BiRepost } from "react-icons/bi";
import toast from "react-hot-toast";
import PostMenu from "../../menu/PostMenu";

const RepostInfo = ({
  reposter,
  isQuote,
  reposterProfileUrl,
  handleLinkClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 1,
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        color: theme.palette.text.secondary,
        fontSize: "0.875rem",
      }}
      role="region"
      aria-label={isQuote ? "Quote information" : "Repost information"}
    >
      <BiRepost size={16} aria-label="Repost icon" />
      <Typography variant="caption" fontWeight={500}>
        {isQuote ? "Quoted" : "Reposted"} by{" "}
        <MuiLink
          component={RouterLink}
          to={reposterProfileUrl}
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
              color: "primary.main",
            },
            cursor: reposterProfileUrl === "/" ? "not-allowed" : "pointer",
          }}
          aria-label={`View profile of ${reposter?.username || "unknown"}`}
          onClick={(e) => handleLinkClick(e, reposterProfileUrl)}
        >
          @{reposter?.username || "unknown"}
        </MuiLink>
      </Typography>
      <Typography
        variant="caption"
        fontWeight={600}
        fontSize={14}
        sx={{ color: "text.primary" }}
      >
        {reposter?.displayName || "Unknown User"}
      </Typography>
    </Box>
  );
};

const PostBody = ({
  user,
  author = {},
  originalThreadAuthor = {},
  reposter = null,
  text = "",
  quoteText = "",
  createdAt = new Date(),
  media = [],
  threadId,
  isRepost = false,
  isQuote = false,
  onDelete
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const formatTime = (date) => {
    const parsedDate = new Date(date);
    const now = new Date();
    const hoursDiff = (now - parsedDate) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      return format(parsedDate, "MMM d");
    }
    return formatDistanceToNow(parsedDate)
      .replace("about ", "")
      .replace(" hours", "h")
      .replace(" hour", "h")
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" seconds", "s")
      .replace(" second", "s");
  };

  const handleDeleteThread = () => {
    onDelete(threadId);
  };

  const formattedTime = useMemo(() => formatTime(createdAt), [createdAt]);

  const displayAuthor = isRepost || isQuote ? originalThreadAuthor : author;

  const fallbackUser = {
    displayName: "Unknown User",
    username: "unknown",
    id: "",
  };
  const safeAuthor = displayAuthor || fallbackUser;

  const authorProfileUrl =
    safeAuthor?.username && (safeAuthor?._id || safeAuthor?.id)
      ? `/${safeAuthor.username}`
      : "/";
  const reposterProfileUrl =
    reposter && reposter?.username && (reposter?._id || reposter?.id)
      ? `/${reposter.username}`
      : "/";

  const ThreadDetailViewUrl = `/${safeAuthor.username}/${threadId}`;

  const handleLinkClick = (event, url) => {
    event.preventDefault();
    event.stopPropagation();
    if (url !== "/") {
      navigate(url);
    } else {
      toast.error("This profile is not available.");
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative", 
          p: { xs: 1.5, sm: 2 },
          maxWidth: "600px",
          mx: "auto",
          borderRadius: 2,
        
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          <PostMenu
            postAuthorId={author.id || author._id}
            currentUserId={user?.id || user?._id}
            threadId={threadId}
            onDelete={handleDeleteThread}
          />
        </Box>

        {(isRepost || isQuote) && reposter && (
          <RepostInfo
            reposter={reposter}
            isQuote={isQuote}
            reposterProfileUrl={reposterProfileUrl}
            handleLinkClick={handleLinkClick}
          />
        )}

        <Box
          sx={{
            border: isQuote ? `1px solid ${theme.palette.divider}` : "none",
            borderRadius: isQuote ? theme.shape.borderRadius * 2 : 0,
            p: isQuote ? 1.5 : 0,
            boxShadow: isQuote ? theme.shadows[1] : "none",
            bgcolor: isQuote
              ? theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : theme.palette.grey[50]
              : "transparent",
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
            <Typography
              fontWeight={600}
              fontSize={14}
              fontFamily="inherit"
              component={MuiLink}
              to={authorProfileUrl}
              sx={{
                color: "text.primary",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "primary.main",
                },
                cursor: authorProfileUrl === "/" ? "not-allowed" : "pointer",
              }}
              aria-label={`View profile of ${safeAuthor?.displayName}`}
              onClick={(e) => handleLinkClick(e, authorProfileUrl)}
            >
              {safeAuthor?.displayName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component={MuiLink}
              to={authorProfileUrl}
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "primary.main",
                },
                cursor: authorProfileUrl === "/" ? "not-allowed" : "pointer",
              }}
              aria-label={`View profile of ${safeAuthor?.username}`}
              onClick={(e) => handleLinkClick(e, authorProfileUrl)}
            >
              @{safeAuthor?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              · {formattedTime}
            </Typography>
          </Box>

          {isQuote && quoteText && (
            <Typography
              fontSize={15}
              sx={{ whiteSpace: "pre-wrap", mb: 1, color: "text.secondary" }}
            >
              {quoteText}
            </Typography>
          )}

          <Typography
            variant="body1"
            component={MuiLink}
            to={ThreadDetailViewUrl}
            aria-label={`View thread details of ${threadId || "unknown"}`}
            onClick={(e) => handleLinkClick(e, ThreadDetailViewUrl)}
            sx={{
              fontSize: 15,
              whiteSpace: "pre-wrap",
              color: "text.primary",
              textDecoration: "none",
              "&:hover": { textDecoration: "none" },
              cursor: ThreadDetailViewUrl === "/" ? "not-allowed" : "pointer",
            }}
          >
            {text || "No content"}
          </Typography>

          {media.length > 0 && (
            <PostMedia
              media={media}
              threadId={threadId}
              sx={{ borderRadius: 2, overflow: "hidden", mt: 1 }}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default PostBody;
