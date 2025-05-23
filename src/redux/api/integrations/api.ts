import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import {
  IntegrationResponseDTO,
  IntegrationsQueryRequestDTO,
  IntegrationsResponseDTO,
  UnansweredIntegrationCommentDTO,
} from '.';

export const integrationsApi = createApi({
  reducerPath: 'integrationsApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Integrations', 'IntegrationComments'],
  endpoints: builder => ({
    getIntegration: builder.query<IntegrationResponseDTO, string>({
      query: integrationId => ({
        url: `/integrations/${integrationId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    createIntegration: builder.mutation<IntegrationResponseDTO, string>({
      query: campaign_id => ({
        url: `/integrations?campaign_id=${campaign_id}`,
        method: 'POST',
      }),
    }),
    postCommentIntegrations: builder.mutation<boolean, { commentId: string; isHate: boolean }>({
      query: ({ commentId, isHate }) => ({
        url: `/integrations/comments/${commentId}`,
        method: 'POST',
        body: { is_hate: isHate },
        validateStatus: response => response.status < 400,
      }),
    }),

    getUnansweredIntegrationComment: builder.query<UnansweredIntegrationCommentDTO, string>({
      query: integrationId => ({
        url: `/integrations/comments/${integrationId}`,
        method: 'GET',
      }),
      providesTags: (_error, _result, integrationId) => [{ type: 'IntegrationComments' as const, id: integrationId }],
    }),
    getIntegrations: builder.query<IntegrationsResponseDTO, IntegrationsQueryRequestDTO | void>({
      query: queryParams => {
        const params = {
          ...(queryParams || {}),
          limit: '200', // Лимит интеграций limit=200
        };

        const queryString = Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');

        return {
          url: `/integrations${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Integrations'],
    }),
    updateTimeLeft: builder.mutation<IntegrationResponseDTO, string>({
      query: integrationId => ({
        url: `/integrations/${integrationId}/time_left`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Integrations'],
    }),
    publishIntegration: builder.mutation<IntegrationResponseDTO, string>({
      query: integrationId => ({
        url: `/integrations/${integrationId}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Integrations'],
    }),
  }),
});

export const {
  useGetIntegrationQuery,
  useCreateIntegrationMutation,
  useGetIntegrationsQuery,
  usePostCommentIntegrationsMutation,
  useGetUnansweredIntegrationCommentQuery,
  useUpdateTimeLeftMutation,
  usePublishIntegrationMutation,
} = integrationsApi;
