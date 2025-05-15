import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://springfallusa-76wx.onrender.com/api/comments',  // ✅ Corrected here
    credentials: 'include',
  }),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: (commentData) => ({
        url: '/post-comment',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comments', id: postId },
      ],
    }),
    getComments: builder.query({
      query: () => ({
        url: '/total-comments',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCommentsQuery, usePostCommentMutation } = commentApi;

export default commentApi;
