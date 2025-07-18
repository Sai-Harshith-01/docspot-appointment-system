import { apiSlice } from "./apiSlice";

export const doctorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    doctorSignup: builder.mutation({
      query: (data) => {
        return {
          url: "api/v1/doctors/signup",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllDoctors: builder.query({
      query: () => ({
        url: "api/v1/doctors",
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    changeDoctorStatus: builder.mutation({
      query: (data) => {
        return {
          url: "api/v1/users/change-doctor-status",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Doctors"],
    }),
    updateDoctor: builder.mutation({
      query: (data) => {
        return {
          url: `api/v1/doctors/${data.userId}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Doctors"],
    }),
    getDoctor: builder.query({
      query: (data) => ({
        url: `api/v1/doctors/${data.userId}`,
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    getApprovedDoctors: builder.query({
      query: () => ({
        url: "api/v1/doctors/approved-doctors",
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    checkBookingAvailability: builder.mutation({
      query: (data) => {
        return {
          url: "api/v1/doctors/check-booking-availability",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Doctors"],
    }),
    doctorAppointments: builder.query({
      query: (data) => ({
        url: `api/v1/doctors/appointments/${data.userId}`,
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    appointmentStatus: builder.mutation({
      query: (data) => {
        return {
          url: "api/v1/doctors/change-appointment-status",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Doctors"],
    }),
    bookedAppointments: builder.query({
      query: (data) => ({
        url: `api/v1/doctors/booked-appointments/${data.userId}`,
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
  }),
});

export const {
  useDoctorSignupMutation,
  useGetAllDoctorsQuery,
  useChangeDoctorStatusMutation,
  useUpdateDoctorMutation,
  useGetDoctorQuery,
  useGetApprovedDoctorsQuery,
  useCheckBookingAvailabilityMutation,
  useDoctorAppointmentsQuery,
  useAppointmentStatusMutation,
  useBookedAppointmentsQuery,
} = doctorApiSlice;
