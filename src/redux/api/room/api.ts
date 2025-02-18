import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query.ts';
import { BoostDTO, IEquipItemRequest, IEquipedRoomResponse } from './dto.ts';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['room'],
  endpoints: builder => ({
    getCurrentUserBoost: builder.query<BoostDTO, void>({
      query: () => ({
        url: `/room/me/boost`,
        method: 'GET',
      }),
    }),
    getEquiped: builder.query<IEquipedRoomResponse, void>({
      query: () => ({
        url: `/room/me`,
        method: 'GET',
      }),
      providesTags: ['room'],
    }),
    equipItem: builder.mutation<IEquipedRoomResponse, IEquipItemRequest>({
      query: data => ({
        url: `/room/equip`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['room'],
    }),
  }),
});

export const { useGetCurrentUserBoostQuery, useEquipItemMutation, useGetEquipedQuery } = roomApi;
