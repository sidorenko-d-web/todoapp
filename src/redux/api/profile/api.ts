import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { TopProfilesResponseDTO, UserProfileInfoResponseDTO, UpdateProfileRequestDTO} from './dto';


export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryReauth,
  tagTypes: [ 'Me' ],
  endpoints: builder => ({
    getCurrentUserProfileInfo: builder.query<UserProfileInfoResponseDTO, void>({
      providesTags: [ 'Me' ],
      query: () => ({
        url: `/profiles/me`,
        method: 'GET',
      }),
    }),
    getTopProfiles: builder.query<TopProfilesResponseDTO, void>({ 
      query: () => ({
        url: `/profiles/top`,
        method: 'GET',
      }),
    }),
    updateCurrentUserProfile: builder.mutation<UserProfileInfoResponseDTO, UpdateProfileRequestDTO>({
      query: (data) => ({
        url: "/profiles/me",
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery, useUpdateCurrentUserProfileMutation } = profileApi;
