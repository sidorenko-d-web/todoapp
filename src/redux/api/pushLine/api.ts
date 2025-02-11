import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { PushLineDTO, PushLineDateDTO } from './dto';

export const pushLineApi = createApi({
  reducerPath: 'pushLineApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getPushLine: builder.query<PushLineDTO, void>({
      query: () => ({
        url: '/push_line',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPushLineQuery } = pushLineApi;
