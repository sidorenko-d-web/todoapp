import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetTasksResponse, UpdateTaskRequest, UpdateTaskResponse, GetTaskQuestionsResponse, GetDailyRewardResponse, GetTaskQuestionsErrorResponse, TaskBoost, TaskCategory } from './dto';

export type GetTasksParams = {
  title?: string;
  stages?: number;
  is_completed?: boolean;
  category?: TaskCategory;
  ids?: string[];
  is_assigned?: boolean;
  offset?: number;
  limit?: number;
  is_actual?: boolean;
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Tasks'],
  endpoints: builder => ({
    getTasks: builder.query<GetTasksResponse, GetTasksParams | void>({
      query: (params) => {
        if (!params) return { url: '/assignments', method: 'GET' };
        
        const queryParams: Record<string, string> = {};
        
        if (typeof params.is_actual === 'boolean') {
          queryParams.is_actual = params.is_actual.toString();
        }
        if (typeof params.is_assigned === 'boolean') {
          queryParams.is_assigned = params.is_assigned.toString();
        }
        if (params.category) {
          queryParams.category = params.category;
        }
        if (typeof params.stages === 'number') {
          queryParams.stages = params.stages.toString();
        }
        if (typeof params.is_completed === 'boolean') {
          queryParams.is_completed = params.is_completed.toString();
        }
        if (params.title) {
          queryParams.title = params.title;
        }
        if (params.ids?.length) {
          queryParams.ids = params.ids.join(',');
        }
        if (typeof params.offset === 'number') {
          queryParams.offset = params.offset.toString();
        }
        if (typeof params.limit === 'number') {
          queryParams.limit = params.limit.toString();
        }

        return {
          url: '/assignments',
          method: 'GET',
          params: queryParams
        };
      },
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


