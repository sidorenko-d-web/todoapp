import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';


export const refferalsApi = createApi({
  reducerPath: 'referralsApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getCurrentUsersReferrals: builder.query<any, void>({
      query: () => ({
        url: `/referrals`,
        method: 'GET',
      }),
    }),
   
  }),
});

export const {
  useGetCurrentUsersReferralsQuery,
} = refferalsApi;
