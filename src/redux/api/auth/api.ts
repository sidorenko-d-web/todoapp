import { createApi } from '@reduxjs/toolkit/query/react';

import { caseTransform } from '../../../utils';

import { baseQueryReauth } from '../query';

import type { SignInDTO, SignInResponseDTO } from './dto';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    signIn: builder.mutation<SignInResponseDTO, SignInDTO>({
      query: credentials => {
        const data = caseTransform(credentials, 'snake');
        return { url: '/auth/login', method: 'POST', body: data };
      },
    }),
  }),
});

export const { useSignInMutation } = authApi;
