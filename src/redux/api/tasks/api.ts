import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetTasksResponse, UpdateTaskRequest, UpdateTaskResponse, GetTaskQuestionsResponse, GetDailyRewardResponse, GetTaskQuestionsErrorResponse, TaskBoost } from './dto';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Tasks'],
  endpoints: builder => ({
    getTasks: builder.query<GetTasksResponse, void | { is_actual?: boolean }>({
      query: (params) => ({
        url: '/assignments',
        method: 'GET',
        params: params ? { is_actual: params.is_actual } : undefined,
      }),
      providesTags: ['Tasks']
    }),
    getTaskQuestions: builder.query<GetTaskQuestionsResponse | GetTaskQuestionsErrorResponse, string>({
      query: (assignmentId) => ({
        url: `/assignments/daily/questions/${assignmentId}`,
        method: 'GET',
      })
    }),
    updateTask: builder.mutation<UpdateTaskResponse, { id: string; data: UpdateTaskRequest }>({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tasks']
    }),
    getDailyReward: builder.query<GetDailyRewardResponse, string>({
      query: (assignmentId) => ({
        url: `/assignments/daily/reward/${assignmentId}`,
        method: 'GET'
      }),
      providesTags: ['Tasks']
    }),
    getBoost: builder.query<TaskBoost, void>({
      query: () => ({
        url: '/assignments/boost',
        method: 'GET',
      }),
      providesTags: ['Tasks']
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuestionsQuery,
  useUpdateTaskMutation,
  useGetDailyRewardQuery,
  useGetBoostQuery,
} = tasksApi;


