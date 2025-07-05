import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_CONNECTOR}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extra) => {
  let res = await rawBaseQuery(args, api, extra);
  if (res?.error?.status === 401) {
    const refreshRes = await rawBaseQuery(
      { url: "auth/refresh", method: "POST" },
      api,
      extra
    );

    if (refreshRes?.data?.accessToken) {
      api.dispatch(setCredentials(refreshRes.data));
      res = await rawBaseQuery(args, api, extra);
    } else {
      api.dispatch(logout());
    }
  }

  return res;
};

export const threadApi = createApi({
  reducerPath: "threadApi",
  tagTypes: ["Thread", "Repost"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createThread: builder.mutation({
      query: (body) => ({ url: "thread/create", method: "POST", body }),
      invalidatesTags: ["Thread"],
    }),
    getAllThreads: builder.query({
      query: () => "thread/all",
      providesTags: ["Thread"],
    }),
    getOneThread: builder.query({
      query: ({ id }) => `thread/${id}/one`,
      providesTags: ["singleThread"],
    }),
    replyThread: builder.mutation({
      query: (body) => ({ url: "thread/create", method: "POST", body }),
      invalidatesTags: ["singleThread"],
    }),
    likeThread: builder.mutation({
      query: (id) => ({ url: `thread/${id}/like`, method: "PATCH" }),
      invalidatesTags: ["Thread", "singleThread"],
    }),
    getThreadReplies: builder.query({
      query: ({ id, page = 1, limit = 10 }) =>
        `thread/${id}/replies?page=${page}&limit=${limit}`,
      providesTags: ["replies"],
    }),
    likeReply: builder.mutation({
      query: (id) => ({ url: `thread/${id}/like`, method: "PATCH" }),
      invalidatesTags: ["replies"],
    }),
    deleteThread: builder.mutation({
      query: (id) => ({ url: `thread/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["Thread"],
    }),
    getUserThreads: builder.query({
      query: ({ username, page = 1, limit = 10 }) => `thread/${username}/me-threads?page=${page}&limit=${limit}`,
      providesTags: ["Thread"],
    }),
    getMyReplies: builder.query({
      query: ({ username, page = 1, limit = 10 }) => `thread/${username}/me-replies?page=${page}&limit=${limit}`,
      providesTags: ["myThreadReplies"],
    }),
    getMyReposts: builder.query({
      query: ({ username, page = 1, limit = 10 }) => `thread/${username}/me-reposts?page=${page}&limit=${limit}`,
      providesTags: ["myThreadReposts"],
    }),
    getMyRepliesOfThread: builder.query({
      query: (username) => `thread/replies/all?username=${username}`,
      providesTags: ["myThreadReplies"],
    }),
  }),
});

export const {
  useCreateThreadMutation,
  useGetAllThreadsQuery,
  useLikeThreadMutation,
  useGetOneThreadQuery,
  useGetUserThreadsQuery,
  useGetThreadRepliesQuery,
  useLikeReplyMutation,
  useReplyThreadMutation,
  useDeleteThreadMutation,
  useGetMyRepliesQuery,
  useGetMyRepostsQuery,
  useGetMyRepliesOfThreadQuery,
  useGet,
} = threadApi;
