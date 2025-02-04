import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query.ts';
import { GrowthTreeResponse } from './dto.ts';

export const treeApi = createApi({
  reducerPath: 'tree',
  baseQuery: baseQueryReauth,
  tagTypes: ['Tree'],
  endpoints: builder => ({
    getTreeInfo: builder.query<GrowthTreeResponse, void>({
      query: () => ({
        url: '/growth-tree',
        method: 'GET',
      })
    })
  })
})

export const {
  useGetTreeInfoQuery
} = treeApi