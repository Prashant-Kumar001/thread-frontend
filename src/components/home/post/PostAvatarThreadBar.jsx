import { Link } from "react-router-dom";
import {
  Avatar,
  Stack,
  Tooltip,
  Box,
  AvatarGroup,
  useTheme,
} from "@mui/material";
import { FiUser } from "react-icons/fi";

const PostAvatarThreadBar = ({
  user,
  author,
  replies = [],
  isOwner = false,
}) => {
  const theme = useTheme();

  return (
    <Stack alignItems="center" spacing={1} mr={1.5} width={48}>
      <Box position="relative">
        {isOwner && (
          <Avatar
            sx={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 20,
              height: 20,
              zIndex: 1,
              bgcolor: theme.palette.success.main,
              fontSize: 16,
            }}
          >
            +
          </Avatar>
        )}

        <Tooltip
          arrow
          disableInteractive
          title={`@${author?.username || "Unknown"}`}
          placement="left"
        >
          <Box>
            <Link
              to={author?.username ? `/${author.username}` : "#"}
              style={{ textDecoration: "none" }}
            >
              <Avatar
                src={author?.avatar?.secure_url || ""}
                sx={{ width: 40, height: 40 }}
              >
                {!author?.avatar?.secure_url && <FiUser />}
              </Avatar>
            </Link>
          </Box>
        </Tooltip>
      </Box>

      <Box
        flex={1}
        width={2}
        bgcolor={theme.palette.divider}
        borderRadius={theme.shape.borderRadius}
      />

      {replies.length > 0 && (
        <AvatarGroup
          max={3}
          sx={{
            "& .MuiAvatar-root": {
              width: 24,
              height: 24,
              fontSize: 12,
              color: theme.palette.text.primary,
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[1],
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
            },
          }}
        >
          {replies.map((r, i) => (
            <Tooltip key={i} title={`@${r.username || "User"}`} arrow>
              <Avatar src={r.avatar?.secure_url || ""}>
                {!r.avatar?.secure_url && <FiUser size={12} />}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      )}
    </Stack>
  );
};

export default PostAvatarThreadBar;
