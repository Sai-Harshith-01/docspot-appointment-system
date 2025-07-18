import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyUser: builder.query({
      query: (data) => ({
        url: `/api/v1/users/verify-user/${data.userId}`,
        method: "GET",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/api/v1/users",
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    getUser: builder.query({
      query: (data) => ({
        url: `/api/v1/users/${data.userId}`,
        method: "GET",
      }),
    }),
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: "/api/v1/users/book-appointment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Doctors"],
    }),
    userAppointments: builder.query({
      query: (data) => ({
        url: `/api/v1/users/user-appointments/${data.userId}`,
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: `/api/v1/users/${data.userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctors"],
    }),
  }),
});

export const {
  useVerifyUserQuery,
  useGetAllUsersQuery,
  useGetUserQuery,
  useBookAppointmentMutation,
  useUserAppointmentsQuery,
  useDeleteUserMutation,
} = userApiSlice;
