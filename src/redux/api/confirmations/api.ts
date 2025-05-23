import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { ConfrirmEmailDTO, SendEmailConfirmationCodeDTO, SendPhoneConfirmationCodeDTO } from './dto';

export const confirmationsApi = createApi({
  reducerPath: 'confirmationsApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    sendEmailConfirmationCode: builder.mutation<string, SendEmailConfirmationCodeDTO>({
      query: (body) => ({
        url: `/confirmations/send_confirmation_code/email`,
        method: 'POST',
        body,
      }),
    }),
    sendPhoneConfirmationCode: builder.mutation<string, SendPhoneConfirmationCodeDTO>({
      query: (body) => ({
        url: `/confirmations/send_confirmation_code/phone`,
        method: 'POST',
        body,
      }),
    }),
    confirmEmail: builder.mutation<string, ConfrirmEmailDTO>({
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
  useSendPhoneConfirmationCodeMutation,
  useConfirmEmailMutation,
} = confirmationsApi;