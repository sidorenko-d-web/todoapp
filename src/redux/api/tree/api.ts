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
        params: {
          limit: 450,
        }
      })
    }), 
    unlockAchievement: builder.mutation<string, {achievement_id: string}>({
      query: ({ achievement_id }) => ({
        url: `/growth-tree/${achievement_id}`,
        method: 'POST'
      }),
      invalidatesTags: ['Tree']
    })
  })
})

export const {
  useGetTreeInfoQuery,
  useUnlockAchievementMutation
} = treeApi