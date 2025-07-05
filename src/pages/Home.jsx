import {
  Stack,
  Typography,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllThreadsQuery } from "../redux/services/api/thread";
import { setInput } from "../redux/features/threadSlice";

import Post from "../components/home/Post";
import Input from "../components/home/Input";
import AddPost from "../components/model/AddPost";
import { ThreadActionsProvider } from "../context/ThreadActionsContext";

const ThreadsList = ({ threads, isLoading, isError, error }) => {
  const theme = useTheme();

  return (
    <Stack
      mb={10}
      p={2}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {isLoading && (
        <Stack alignItems="center" mt={4}>
          <CircularProgress />
        </Stack>
      )}
      {isError && (
        <Typography color="error" textAlign="center">
          {error?.data?.message || "Failed to load threads."}
        </Typography>
      )}
      {!isLoading && !threads.length && (
        <Typography textAlign="center" color="text.secondary">
          No threads found.
        </Typography>
      )}
      {threads.map((thread) => (
        <Post
          key={thread._id}
          thread={thread}
          variant="full"
          showReplies={false}
        />
      ))}
    </Stack>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { input } = useSelector((state) => state.thread);

  const {
    data: threadResponse,
    isLoading,
    isError,
    error,
  } = useGetAllThreadsQuery(undefined, {
    skip: !accessToken,
  });

  const threads = threadResponse?.thread || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Home - Threads";
  }, []);

  return (
    <>
      {input && (
        <AddPost open={input} onClose={() => dispatch(setInput(false))} />
      )}
      <Container maxWidth="sm" >
        <Input />
        <ThreadActionsProvider>
          <ThreadsList
            threads={threads}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </ThreadActionsProvider>
      </Container>
    </>
  );
};

export default Home;
