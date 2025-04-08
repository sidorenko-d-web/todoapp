import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query.ts';
import { BoostDTO, IEquipedRoomResponse, IEquipItemRequest, IRemoveItemRequest } from './dto.ts';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: baseQueryReauth,
  tagTypes: [ 'room', 'Boost' ],
  endpoints: builder => ({
    getCurrentUserBoost: builder.query<BoostDTO, void>({
      providesTags: [ 'Boost' ],
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
      providesTags: [ 'room' ],
    }),
    getEquipedById: builder.query<IEquipedRoomResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/room/${id}`,
        method: 'GET',
      }),
      providesTags: [ 'room' ],
    }),
    addItemToRoom: builder.mutation<IEquipedRoomResponse, IEquipItemRequest>({
      query: data => ({
        url: `/room/add`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [ 'room' ],
    }),
    removeItemFromRoom: builder.mutation<IEquipedRoomResponse, IRemoveItemRequest>({
      query: data => ({
        url: `/room/remove`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [ 'room' ],
    }),
  }),
});

export const {
  useGetCurrentUserBoostQuery,
  useAddItemToRoomMutation,
  useRemoveItemFromRoomMutation,
  useGetEquipedQuery,
  useGetEquipedByIdQuery,
} = roomApi;
