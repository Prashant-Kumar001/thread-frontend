import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { CgClose } from "react-icons/cg";
import { FaImages } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  setLoading,
  setError,
  clearError,
  resetThreadState,
} from "../../redux/features/threadSlice";
import { useCreateThreadMutation } from "../../redux/services/api/thread";

const AddPost = ({ open, onClose }) => {
  const theme = useTheme();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.thread);
  const { user } = useSelector((state) => state.auth);

  const [createThread, { isLoading, isSuccess, isError }] =
    useCreateThreadMutation();

  useEffect(() => {
    if (!images.length) {
      setPreviews([]);
      return;
    }
    const urls = images.map((img) => URL.createObjectURL(img));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetThreadState());
      handleDialogClose();
    }
  }, [isSuccess]);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) return;

    dispatch(clearError());
    dispatch(setLoading(true));

    const formData = new FormData();
    if (content.trim()) formData.append("content", content);
    images.forEach((file) => formData.append("media", file));
    formData.append("threadType", "thread");

    try {
      await createThread(formData).unwrap();
      toast.success("Post created successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create post");
      dispatch(setError(err?.data?.message || "Post failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetLocalState = () => {
    setContent("");
    setImages([]);
    setPreviews([]);
  };

  const handleDialogClose = () => {
    resetLocalState();
    dispatch(resetThreadState());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <Box position="absolute" sx={{ top: 8, right: 16 }}>
        <IconButton onClick={handleDialogClose}>
          <CgClose />
        </IconButton>
      </Box>

      <DialogTitle
        textAlign="center"
        sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
      >
        New Thread...
      </DialogTitle>

      <DialogContent>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Something went wrong. Please try again."}
          </Alert>
        )}

        <Stack direction="row" gap={2} mb={2}>
          <Avatar
            src={user?.avatar?.secure_url || ""}
            alt={user?.username || "U"}
          />
          <Stack flex={1} gap={1}>
            <Typography fontWeight="bold" color="text.primary">
              {user?.username || "User"}
            </Typography>

            <TextField
              placeholder="Start a Thread..."
              multiline
              fullWidth
              rows={3}
              variant="standard"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              InputProps={{
                disableUnderline: false,
              }}
              sx={{
                "& .MuiInputBase-root": {
                  color: theme.palette.text.primary,
                },
              }}
            />

            {previews.length > 0 && (
              <Box mt={2}>
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    style={{
                      maxWidth: "100%",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                ))}
              </Box>
            )}

            <Stack direction="row" alignItems="center" mt={1} gap={1}>
              <label htmlFor="image-upload">
                <FaImages size={24} style={{ cursor: "pointer" }} />
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography fontSize="0.875rem" color="text.secondary">
            Anyone can reply
          </Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: 20,
              textTransform: "none",
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              ":hover": {
                bgcolor: theme.palette.primary.dark,
              },
              minWidth: 100,
            }}
            disabled={(!content.trim() && images.length === 0) || isLoading}
            onClick={handlePost}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Post"
            )}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddPost;
