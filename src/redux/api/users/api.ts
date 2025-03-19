import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { GetUserDTO, GetUsersCountDTO, GetUserWelcomeBonusDTO, GetUserWelcomeRequestDTO } from './dto';


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
    getUserWelcomeBonus: builder.query<GetUserWelcomeBonusDTO, GetUserWelcomeRequestDTO>({
      query: (body) => ({
        url: `/users/welcome-bonus`,
        method: 'GET',
        body, // Ensure the body is included
        headers: {
          'Content-Type': 'application/json', // Explicitly set the content type
        },
      }),
    }),
  }),
});

export const {
  useGetUsersCountQuery, useGetUserQuery, useGetUserWelcomeBonusQuery
} = usersApi;
