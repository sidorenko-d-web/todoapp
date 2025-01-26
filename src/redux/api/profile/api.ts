import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { userProfileInfoResponseDTO } from './dto';


export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getCurrentUserProfileInfo: builder.query<userProfileInfoResponseDTO, void>({ 
      query: () => ({
        url: `/profiles/me`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCurrentUserProfileInfoQuery } = profileApi;
