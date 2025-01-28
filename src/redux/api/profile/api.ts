import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { TopProfilesResponseDTO, UserProfileInfoResponseDTO } from './dto';


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
    })
  }),
});

export const { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery } = profileApi;
