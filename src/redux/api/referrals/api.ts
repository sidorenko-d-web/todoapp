import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetReferralsDTO, ReferralCodeDTO } from './dto';

export const referralsApi = createApi({
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
    sendReferralCode: builder.mutation<string, ReferralCodeDTO>({
      query: ({ referral_code, referral_id }) => ({
        url: '/referrals/referral_code',
        method: 'POST',
        body: { referral_code, referral_id },
      }),
      transformErrorResponse: (response) => {
        if (response.status === 404) {
          return { 
            status: response.status,
            message: 'Пригласивший пользователь не найден или передан неверный реферальный код',
            type: 'ReferrerNotFound'
          };
        } else if (response.status === 400) {
          return { 
            status: response.status,
            message: 'Пользователь уже является рефералом',
            type: 'UserAlreadyIsReferral'
          };
        } else if (response.status === 403) {
          return { 
            status: response.status,
            message: 'Регистрация пользователя не была осуществлена через бота',
            type: 'UserNotFoundInBotDatabaseException'
          };
        }
        return { 
          status: response.status || 500,
          message: 'Произошла неизвестная ошибка',
          type: 'UnknownError'
        };
      },
    })
  }),
});

export const {
  useGetCurrentUsersReferralsQuery,
  useMarkPushReminderSentMutation,
  useSendReferralCodeMutation,
} = referralsApi;