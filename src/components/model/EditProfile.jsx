import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Avatar,
  TextField,
  IconButton,
  Button,
  useTheme,
  Typography,
  Tooltip,
} from "@mui/material";
import { CgClose } from "react-icons/cg";
import { FaImages } from "react-icons/fa6";
import { FaMagic } from "react-icons/fa";
import { useUpdateProfileMutation, useGenerateBioMutation } from "../../redux/services/auth/profile";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  setError,
  setLoading,
} from "../../redux/features/profileSlice";
import TransparentLoader from "../common/TransparentLoader";
import { toast } from "react-hot-toast";

const EditProfile = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [changeProfile] = useUpdateProfileMutation();
  const [generateBio, { isLoading: isBioLoading }] = useGenerateBioMutation();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleSave = async () => {
    if (!displayName && !bio && !website && !image) {
      return toast.error("Nothing to update");
    }

    const formData = new FormData();
    if (displayName) formData.append("displayName", displayName);
    if (bio) formData.append("bio", bio);
    if (website) formData.append("website", website);
    if (image) formData.append("avatar", image);

    const toastId = toast.loading("Updating profile...");
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      await changeProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      const msg = err?.data?.message || "Something went wrong";
      toast.error(msg);
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

  const handleGenerateBio = async () => {
    const toastId = toast.loading("Generating bio...");
    try {
      const { bio: generatedBio } = await generateBio().unwrap();
      console.log(generatedBio);
      // setBio(generatedBio);
      toast.success("AI-generated bio added");
      toast.dismiss(toastId);
    } catch (err) {
      toast.error("Failed to generate bio");
    }finally {
      toast.dismiss(toastId);
    }

  };

  return (
    <>
      {loading && <TransparentLoader />}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <Box position="absolute" top={16} right={16}>
          <IconButton onClick={onClose}>
            <CgClose size={20} />
          </IconButton>
        </Box>

        <DialogTitle textAlign="center" sx={{ fontWeight: "bold" }}>
          Edit Profile
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
           
            <Box display="flex" justifyContent="center">
              <Avatar
                src={preview || ""}
                alt="profile-preview"
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: theme.palette.grey[400],
                  transition: "0.3s",
                  ":hover": {
                    transform: "scale(1.05)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              />
            </Box>

            
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <label htmlFor="avatar">
                <Tooltip title="Upload new avatar">
                  <IconButton component="span">
                    <FaImages size={22} />
                  </IconButton>
                </Tooltip>
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Typography variant="caption" color="text.secondary">
                Upload profile image
              </Typography>
            </Stack>

           
            <TextField
              label="Display Name"
              variant="outlined"
              fullWidth
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />




            <Box position="relative">
              <TextField
                label="Bio"
                variant="outlined"
                fullWidth
                multiline
                maxRows={4}
                placeholder="Tell people a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              {/* <Tooltip title="Generate bio with AI">
                <IconButton
                  size="small"
                  onClick={handleGenerateBio}
                  disabled={isBioLoading}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    opacity: 0.8,
                  }}
                >
                  <FaMagic size={18} />
                </IconButton>
              </Tooltip> */}
            </Box>

            <TextField
              label="Website"
              variant="outlined"
              fullWidth
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                borderRadius: "30px",
                fontWeight: "bold",
                py: 1.2,
                fontSize: "1rem",
                bgcolor: theme.palette.primary.main,
                ":hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
              disabled={loading}
              fullWidth
            >
              Save Changes
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfile;
