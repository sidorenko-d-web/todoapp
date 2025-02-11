import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetTasksResponse, UpdateTaskRequest, UpdateTaskResponse } from './dto';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getTasks: builder.query<GetTasksResponse, void>({
      query: () => ({
        url: '/assignments',
        method: 'GET',
      }),
    }),
    updateTask: builder.mutation<UpdateTaskResponse, { id: string; data: UpdateTaskRequest }>({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useUpdateTaskMutation,
} = tasksApi;


