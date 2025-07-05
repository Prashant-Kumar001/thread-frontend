import { Avatar, Box, Card, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const RepostsPage = ({ repost }) => {
  const { author, originalThread, createdAt } = repost;

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="caption" color="text.secondary">
        <Link
          to={`/${author.username}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          @{author.username}
        </Link>{" "}
        reposted
      </Typography>
      <Box display="flex" gap={2} mt={1}>
        <Link to={`/${originalThread.author.username}`}>
          <Avatar
            src={originalThread.author.avatar.secure_url}
            alt={originalThread.author.username}
          />
        </Link>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            <Link
              to={`/${originalThread.author.username}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              @{originalThread.author.username}
            </Link>
            <strong> {originalThread.author.displayName}</strong>
          </Typography>
          <Typography
            sx={{ mt: 0.5 }}
            component={Link}
            to={`/thread/${originalThread._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {originalThread.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default RepostsPage;
