import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { IntegrationResponseDTO, IntegrationsResponseDTO } from './dto';

export const integrationsApi = createApi({
  reducerPath: 'integrationsApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getIntegration: builder.query<IntegrationResponseDTO, string>({
      query: integrationId => ({
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
