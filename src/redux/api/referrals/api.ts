import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetReferralsDTO } from './dto';


export const refferalsApi = createApi({
  reducerPath: 'referralsApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getCurrentUsersReferrals: builder.query<GetReferralsDTO, void>({
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
