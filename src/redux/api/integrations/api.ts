import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import {
  CreateIntegrationRequestDTO,
  IntegrationResponseDTO,
  IntegrationsQueryRequestDTO,
  IntegrationsResponseDTO, UnansweredIntegrationCommentDTO,
} from '.';

export const integrationsApi = createApi({
  reducerPath: 'integrationsApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['Integrations', 'IntegrationComments'],
  endpoints: (builder) => ({
    getIntegration: builder.query<IntegrationResponseDTO, string>({
      query: (integrationId) => ({
        url: `/integrations/${integrationId}`,
        method: 'GET',
      }),
    }),
    createIntegration: builder.mutation<IntegrationResponseDTO, CreateIntegrationRequestDTO>({
      query: (body) => ({
        url: '/integrations',
        method: 'POST',
        body,
      }),
    }),
    postCommentIntegrations: builder.mutation<boolean, { commentId: string; isHate: boolean }>({
      query: ({ commentId, isHate }) => ({
        url: `/integrations/comments/${commentId}`,
        method: 'POST',
        body: { is_hate: isHate },
      }),
    }),

    getUnansweredIntegrationComment: builder.query<UnansweredIntegrationCommentDTO, string>({
      query: (integrationId) => ({
        url: `/integrations/comments/${integrationId}`,
        method: 'GET',
      }),
      providesTags: (_error, _result, integrationId) => [
        { type: 'IntegrationComments' as const, id: integrationId }
      ],
    }),
    getIntegrations: builder.query<IntegrationsResponseDTO, IntegrationsQueryRequestDTO | void>({
      query: (queryParams) => {
        const params = queryParams
          ? Object.entries(queryParams)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&')
          : '';

        return {
          url: `/integrations${params ? `?${params}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Integrations'],
    }),
    getAllIntegrations: builder.query<IntegrationsResponseDTO, void>({
      query: () => ({
        url: '/integrations',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetIntegrationQuery,
  useCreateIntegrationMutation,
  useGetIntegrationsQuery,
  useGetAllIntegrationsQuery,
  usePostCommentIntegrationsMutation,
  useGetUnansweredIntegrationCommentQuery,
} = integrationsApi;
