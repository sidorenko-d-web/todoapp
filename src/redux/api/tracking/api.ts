import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { PostEventRequestBody, PostEventResponse } from '.';

export const trackingApi = createApi({
  reducerPath: 'trackingApi',
  baseQuery: baseQueryReauth,
  tagTypes: [ 'Integrations', 'IntegrationComments' ],
  endpoints: (builder) => ({
    postEvent: builder.mutation<PostEventResponse, PostEventRequestBody>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  usePostEventMutation,
} = trackingApi;
