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

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    me: builder.query({
      query: (username) => `profile/me/${username}`,
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "profile",
        method: "PUT",
        body,
        formData: true,
      }),
      invalidatesTags: ["Profile"],
    }),
    followToggle: builder.mutation({
      query: ({ username }) => ({
        url: `profile/follow/${username}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Profile"],
    }),
    searchProfiles: builder.query({
      query: (query) => ({
        url: `profile/search?query=${query}`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    getFollows: builder.query({
      query: ({ username, type, page = 1, limit = 10 }) =>
        `profile/${username}/${type}/users?page=${page}&limit=${limit}`,
      providesTags: ["followers", "following"],
    }),

    likeProfile: builder.mutation({
      query: ({ username }) => ({
        url: `profile/like/${username}`,
        method: "POST",
      }),
      invalidatesTags: ["followers", "following"],
    }),
    generateBio: builder.mutation({
      query: (body) => ({
        url: "profile/generate-bio",
        method: "POST",
        body,
      }),
    })
  }),
});

export const {
  useMeQuery,
  useUpdateProfileMutation,
  useFollowToggleMutation,
  useSearchProfilesQuery,
  useGetFollowsQuery,
  useLikeProfileMutation, 
  useGenerateBioMutation      
     
} = profileApi;
