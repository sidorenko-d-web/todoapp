import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query.ts';
import { BoostDTO } from './dto.ts';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getCurrentUserBoost: builder.query<BoostDTO, void>({
      query: () => ({
        url: `/room/me/boost`,
        method: 'GET',
      }),
    }),

  }),
});

export const {
  useGetCurrentUserBoostQuery,
} = roomApi;