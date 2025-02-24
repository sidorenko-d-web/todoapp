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
    markPushReminderSent: builder.mutation<string, number>({
      query: (referral_id) => ({
        url: `/referrals/reminded_at/${referral_id}`,
        method: 'PATCH',
      }),
      transformErrorResponse: (response) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetCurrentUsersReferralsQuery,
  useMarkPushReminderSentMutation,
} = refferalsApi;