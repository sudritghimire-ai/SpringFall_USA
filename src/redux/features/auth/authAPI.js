import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://springfallusa.onrender.com/api/auth', // Base URL set to /api/auth
    credentials: 'include',
  }),
  tagTypes: ['User'], // Tagging for cache invalidation
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/register', // Appends to http://localhost:5000/api/auth/register
        method: 'POST',
        body: newUser,
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login', // Appends to http://localhost:5000/api/auth/login
        method: 'POST',
        body: credentials,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout', // Appends to http://localhost:5000/api/auth/logout
        method: 'POST',
      }),
    }),

    getUser: builder.query({
      query: () => ({
        url: '/users', // Appends to http://localhost:5000/api/auth/users
        method: 'GET',
      }),
      refetchOnMountOrArgChange: true, // Ensures data is refetched when the component mounts
      providesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`, // Appends to http://localhost:5000/api/auth/users/{userId}
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`, // Appends to http://localhost:5000/api/auth/users/{userId}
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation
} = authApi;

export default authApi;
