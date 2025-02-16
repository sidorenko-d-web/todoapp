import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';

export const confirmationsApi = createApi({
  reducerPath: 'confirmationsApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    sendEmailConfirmationCode: builder.mutation<string, { email: string }>({
      query: (body) => ({
        url: `/confirmations/send_confirmation_code/email`,
        method: 'POST',
        body,
      }),
    }),
    confirmEmail: builder.mutation<string, { email: string; confirmation_code: string }>({
      query: (body) => ({
        url: `/confirmations/confirm`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useSendEmailConfirmationCodeMutation,
  useConfirmEmailMutation,
} = confirmationsApi;