import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetUserThreadsQuery } from "../redux/services/api/thread";

const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 10;

export default function useUserThreads() {
  const { username = "" } = useParams();
  const { user } = useSelector((state) => state.auth ?? {});

  const skipFetch = !user || !username;

  const { data, isLoading, isFetching, isError, error } =
    useGetUserThreadsQuery(
      { username, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT },
      { skip: skipFetch }
    );

  const threads = data?.threads ?? [];

  return {
    user,
    username,
    threads,
    isLoading: isLoading || isFetching,
    isError,
    error,
  };
}