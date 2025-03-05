// api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { ChestRewardResponseDTO, ChestRewardRequestDTO } from './dto';

export const chestApi = createApi({
  reducerPath: 'chestApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Chest'],
  endpoints: builder => ({
    claimChestReward: builder.mutation<ChestRewardResponseDTO, ChestRewardRequestDTO>({
      query: (params) => ({
        url: `/chests`,
        method: 'POST',
        params,
      }),
    }),
  }),
});

export const {
  useClaimChestRewardMutation,
} = chestApi;
