import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import RepostsPage from "../../components/home/post/Repos/RepostsPage";
import { useGetMyRepostsQuery } from "../../redux/services/api/thread";


const Empty = ({ children }) => (
  <Stack alignItems="center" mt={4}>
    <Typography color="text.secondary">{children}</Typography>
  </Stack>
);


const Repost = () => {
  const { username } = useParams();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetMyRepostsQuery(
    { username, page: 1, limit: 10 },
    { skip: !username }
  );

  if (isLoading || isFetching) {
    return (
      <Stack alignItems="center" mt={5}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Stack alignItems="center" mt={4}>
        <Typography color="error">
          {error?.data?.message || "Failed to load reposts"}
        </Typography>
      </Stack>
    );
  }

  const { reposts, total } = data;

  return (
    <Stack spacing={2} mb={10}>
      {reposts.length === 0 ? (
        <Empty>No reposts yet.</Empty>
      ) : (
        reposts.map((repost) => (
          <RepostsPage key={repost._id} repost={repost} />
        ))
      )}
    </Stack>
  );
};

export default Repost;
