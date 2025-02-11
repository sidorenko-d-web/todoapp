import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetUserDTO, GetUsersCountDTO } from './dto';


export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getUser: builder.query<GetUserDTO, void>({
      query: () => ({
        url: `/users/me`,
        method: 'GET',
      }),
    }),
    getUsersCount: builder.query<GetUsersCountDTO, void>({
      query: () => ({
        url: `/users/players-count`,
        method: 'GET',
      }),
    }),
   
  }),
});

export const {
  useGetUsersCountQuery, useGetUserQuery
} = usersApi;
