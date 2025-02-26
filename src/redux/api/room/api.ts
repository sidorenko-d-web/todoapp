import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query.ts';
import { BoostDTO, IEquipItemRequest, IEquipedRoomResponse, IRemoveItemRequest } from './dto.ts';

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
    addItemToRoom: builder.mutation<IEquipedRoomResponse, IEquipItemRequest>({
      query: data => ({
        url: `/room/add`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['room'],
    }),
    removeItemFromRoom: builder.mutation<IEquipedRoomResponse, IRemoveItemRequest>({
      query: data => ({
        url: `/room/remove`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['room'],
    }),
  }),
});

export const {
  useGetCurrentUserBoostQuery,
  useAddItemToRoomMutation,
  useRemoveItemFromRoomMutation,
  useGetEquipedQuery,
} = roomApi;
