import React, { Fragment } from "react";
import {
  Stack,
  Typography,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Post from "../../components/home/Post";
import { ThreadActionsProvider } from "../../context/ThreadActionsContext";
import { useGetUserThreadsQuery } from "../../redux/services/api/thread";

const Empty = ({ children }) => (
  <Stack alignItems="center" mt={4}>
    <Typography color="text.secondary">{children}</Typography>
  </Stack>
);

const ThreadsContent = () => {
  const { username = "" } = useParams();
  const { user } = useSelector((state) => state.auth ?? {});

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserThreadsQuery({
    username,
    page: 1,
    limit: 10,
  }, {
    skip: !user || !username,
  });

  const threads = data?.threads ?? [];

  if (!user) return <Empty>Please log in to view threads.</Empty>;

  if (!username)
    return (
      <Empty>No username in the URL&nbsp;— try selecting a profile again.</Empty>
    );

  if (isLoading || isFetching)
    return (
      <Stack alignItems="center" mt={5}>
        <CircularProgress />
      </Stack>
    );

  if (isError)
    return (
      <Empty>
        Couldn’t load threads&nbsp;
        {error?.status ? `(status ${error.status})` : ""}.<br />
        Please try again later.
      </Empty>
    );

  return (
      <Stack flexDirection="column" gap={2} mb={5}>
        {threads.length === 0 && <Empty>No threads found.</Empty>}
        {threads.map((thread) => (
          <Post
            key={thread._id ?? thread.id}
            thread={thread}
            variant="compact"
          />
        ))}
      </Stack>
  );
};

const Threads = () => (
  <ThreadActionsProvider>
    <ThreadsContent />
  </ThreadActionsProvider>
);

export default Threads;
