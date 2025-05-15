import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://springfallusa-76wx.onrender.com/api/',
    credentials: 'include',
   prepareHeaders: (headers) => {
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers; // THIS LINE WAS TOO HARD
}
,
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: ({ search = '', category = '', location = '' }) =>
        `/blogs?search=${search}&category=${category}&location=${location}`,
    }),
    fetchBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
    }),
    fetchRelatedBlogs: builder.query({
      query: (id) => `/blogs/related/${id}`,
    }),
    postBlog: builder.mutation({
      query: (newPost) => ({
        url: '/blogs/create-post',
        method: 'POST',
        body: newPost,
      }),
    }),
    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/blogs/update-post/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { 
  useFetchBlogsQuery, 
  useFetchBlogByIdQuery, 
  useFetchRelatedBlogsQuery,
  usePostBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation
} = blogApi;


/*prepareHeaders: (headers) => {
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}
*/ // VERY IMPORTANT CODE 