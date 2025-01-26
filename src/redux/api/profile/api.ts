import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';


export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getCurrentUserProfileInfo: builder.query<any, void>({ 
      query: () => ({
        url: `/profiles/me`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCurrentUserProfileInfoQuery } = profileApi;
