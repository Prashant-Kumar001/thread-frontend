import React from "react";
import { useSelector } from "react-redux";
import { useCreateThreadMutation } from "../../redux/services/api/thread";
import {
  Avatar,
  IconButton,
  InputBase,
  Stack,
  CircularProgress,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { toast } from "react-hot-toast";
import TransplantLoader from "../common/TransparentLoader";
import { FiSend } from "react-icons/fi";

const MAX_LENGTH = 280;

const Input = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = React.useState("");
  const [createThread, { isLoading: isCreating }] = useCreateThreadMutation();

  const trimmedContent = content.trim();

  const handleCreatePost = () => {
    if (!trimmedContent) return;

    toast
      .promise(
        createThread({ content: trimmedContent, userId: user._id, threadType: "thread" }).unwrap(),
        {
          loading: "Creating post...",
          success: "Post created successfully!",
          error: "Failed to create post. Please try again.",
        }
      )
      .then(() => {
        setContent("");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isCreating && trimmedContent) {
      e.preventDefault();
      handleCreatePost();
    }
  };

  const handleChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setContent(e.target.value);
    }
  };

  return (
    <>
      {isCreating && <TransplantLoader />}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreatePost();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: { xs: 1.5, sm: 2 },
          my: 1,
          mx: "auto",
          maxWidth: "600px",
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
        aria-describedby="post-status"
      >
        <Stack direction="row" alignItems="center" spacing={1.5} flexGrow={1}>
          <Avatar
            src={user?.avatar?.secure_url || ""}
            alt={`${user?.username || "User"}'s profile`}
            sx={{
              width: 32,
              height: 32,
              borderColor: "grey.300",
            }}
          />
          <InputBase
            id="post-input"
            placeholder="Start a thread..."
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            fullWidth
            multiline
            maxRows={4}
            aria-label="Create a new thread"
            sx={{
              fontSize: "1rem",
              fontFamily: "'Inter', 'Roboto', sans-serif",
              color: "text.primary",
              "& .MuiInputBase-input::placeholder": {
                color: "grey.500",
                opacity: 1,
              },
            }}
          />
        </Stack>
        <Stack alignItems="flex-end" spacing={0.5}>
          <IconButton
            disabled={!trimmedContent || isCreating}
            onClick={handleCreatePost}
            aria-label="Post thread"
            sx={{
              color: !trimmedContent ? "grey.400" : "primary.main",
              "&:hover": {
                color: "primary.dark",
              },
              "&:disabled": {
                color: "grey.400",
              },
            }}
          >
            {isCreating ? (
              <CircularProgress size={20} sx={{ color: "grey.400" }} />
            ) : (
              <FiSend size={20} />
            )}
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              
            }}
          >
            {content.length}/{MAX_LENGTH}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default Input;
