import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';

export const integrationsApi = createApi({
  reducerPath: 'integrationsApi',
  baseQuery: baseQueryReauth,
  tagTypes: [ 'Integrations' ],
  endpoints: builder => ({
    getIntegration: builder.query<IntegrationResponseDTO, string>({
      query: integrationId => ({
    createIntegration: builder.mutation<IntegrationResponseDTO, CreateIntegrationRequestDTO>({
      query: (body) => ({
        url: '/integrations',
        method: 'POST',
        body,
      }),
    }),
    getIntegrations: builder.query<IntegrationsResponseDTO, IntegrationsQueryRequestDTO | void>({
      providesTags: [ 'Integrations' ],
      query: (queryParams) => {
        const params = queryParams
          ? Object.entries(queryParams)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([ _, value ]) => value !== undefined && value !== null)
            .map(([ key, value ]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&')
          : '';

        return {
          url: `/integrations${params ? `?${params}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getIntegration: builder.query<IntegrationResponseDTO, string>({
      query: (integrationId) => ({
        url: `/integrations/${integrationId}`,
        method: 'GET',
      }),
    }),

    getAllIntegrations: builder.query<IntegrationsResponseDTO, void>({
      query: () => ({
        url: '/integrations',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetIntegrationQuery, useGetAllIntegrationsQuery } = integrationsApi;
