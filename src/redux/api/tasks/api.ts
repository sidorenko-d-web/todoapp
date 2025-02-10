import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetTasksResponse } from './dto';

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
  }),
});

export const {
  useGetTasksQuery,
} = tasksApi;


