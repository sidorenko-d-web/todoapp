import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query.ts';
import { ICharacterResponse, IUpdateCharacterRequest } from './dto.ts';

export const characterApi = createApi({
  reducerPath: 'characterApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['character'],
  endpoints: builder => ({
    getCharacter: builder.query<ICharacterResponse, void>({
      query: () => ({
        url: `/characters/me`,
        method: 'GET',
      }),
      providesTags: ['character'],
    }),
    updateCharacter: builder.mutation<ICharacterResponse, IUpdateCharacterRequest>({
      query: data => ({
        url: `/characters/me`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['character'],
    }),
    getCharacterById: builder.query<ICharacterResponse, { id: string }>({
      query: data => ({
        url: `/room/remove`,
        method: 'GET',
        body: data,
      }),
      providesTags: ['character'],
    }),
  }),
});

export const { useGetCharacterByIdQuery, useGetCharacterQuery, useUpdateCharacterMutation } = characterApi;
