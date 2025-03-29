import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import {
  BuySubscriptionRequestDTO,
  ITopProfilesInfoRequest,
  TopProfilesResponseDTO,
  UpdateProfileRequestDTO,
  UserProfileInfoResponseDTO,
} from './dto';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Me'],
  endpoints: builder => ({
    getProfileMe: builder.query<UserProfileInfoResponseDTO, void>({
      providesTags: ['Me'],
      query: () => ({
        url: `/profiles/me`,
        method: 'GET',
      }),
    }),
    getProfileMeWithPolling: builder.query<UserProfileInfoResponseDTO, void>({
      providesTags: ['Me'],
      query: () => ({
        url: `/profiles/me`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    getTopProfiles: builder.query<TopProfilesResponseDTO, ITopProfilesInfoRequest>({
      query: params => ({
        url: `/profiles/top`,
        method: 'GET',
        params,
      }),
    }),
    updateCurrentUserProfile: builder.mutation<UserProfileInfoResponseDTO, UpdateProfileRequestDTO>({
      query: data => ({
        url: '/profiles/me',
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    buySubscription: builder.mutation<void, BuySubscriptionRequestDTO>({
      query: payment_method => ({
        url: '/profiles/buy-subscription',
        method: 'POST',
        params: payment_method,
      }),
    }),
    getUserProfileInfoById: builder.query<UserProfileInfoResponseDTO, string>({
      query: profile_id => ({
        url: `/profiles/${profile_id}`,
        method: 'GET',
      }),
    }),
  }),
});
export const {
  useGetProfileMeQuery,
  useGetTopProfilesQuery,
  useUpdateCurrentUserProfileMutation,
  useBuySubscriptionMutation,
  useGetUserProfileInfoByIdQuery,
  useGetProfileMeWithPollingQuery,
} = profileApi;
