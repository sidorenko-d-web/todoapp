import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetUsersCountDTO } from './dto';


export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getUsersCount: builder.query<GetUsersCountDTO, void>({
      query: () => ({
        url: `/users/players-count`,
        method: 'GET',
      }),
    }),
   
  }),
});

export const {
  useGetUsersCountQuery,
} = usersApi;
