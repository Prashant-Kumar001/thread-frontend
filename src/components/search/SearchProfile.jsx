import { Avatar, Button, Stack, Typography, useTheme } from "@mui/material";
import { useFollowToggleMutation } from "../../redux/services/auth/profile";
import { useNavigate } from "react-router-dom";

const SearchProfile = ({ profile }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [toggleFollow, { isLoading: isToggling }] = useFollowToggleMutation();

  const {
    username,
    bio,
    totalFollowers,
    totalFollowing,
    avatar,
    isFollowed,
  } = profile;

  const handleFollowToggle = (e) => {
    e.stopPropagation(); // Prevent navigation on button click
    toggleFollow({ username });
  };

  const handleNavigateToProfile = () => {
    navigate(`/${username}`);
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={2}
      gap={2}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="15px"
      onClick={handleNavigateToProfile}
      sx={{
        backgroundColor: theme.palette.background.paper,
        ":hover": {
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
        },
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={avatar?.secure_url}
          alt={`${username}'s profile`}
          sx={{ width: 48, height: 48 }}
        />
        <Stack spacing={0.5}>
          <Typography fontWeight="bold" fontSize="1rem">
            {username}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {bio}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {totalFollowers} followers · {totalFollowing} following
          </Typography>
        </Stack>
      </Stack>

      <Button
        variant="outlined"
        size="small"
        onClick={handleFollowToggle}
        disabled={isToggling}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          px: 2.5,
          height: 36,
          fontWeight: 500,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          ":hover": {
            bgcolor: theme.palette.text.primary,
            color: theme.palette.background.default,
            borderColor: theme.palette.text.primary,
          },
        }}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </Stack>
  );
};

export default SearchProfile;
