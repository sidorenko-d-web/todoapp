import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';


export const confirmationsApi = createApi({
  reducerPath: 'confirmationsApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    sendEmailConfirmationCode: builder.query<string, void>({
      query: () => ({
        url: `/profiles/me`,
        method: 'POST',
      }),
    }),
    confirmEmail: builder.query<string, void>({
        query: () => ({
          url: `/confirmations/confirm`,
          method: 'PATCH',
        }),
      }),
  }),
});

export const {
    useSendEmailConfirmationCodeQuery,
    useConfirmEmailQuery
} = confirmationsApi;
