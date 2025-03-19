import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { ChestRewardRequestDTO, ChestRewardResponseDTO } from './dto';

export const chestApi = createApi({
  reducerPath: 'chestApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Chest'],
  endpoints: builder => ({
    claimChestReward: builder.mutation<ChestRewardResponseDTO, ChestRewardRequestDTO>({
      query: (body) => ({
        url: `/chests`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useClaimChestRewardMutation,
} = chestApi;
