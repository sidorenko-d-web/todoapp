import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { CompaniesQueryRequestDTO, CompaniesResponseDTO } from '.';

export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  baseQuery: baseQueryReauth,
  endpoints: builder => ({
    getCompanies: builder.query<CompaniesResponseDTO, CompaniesQueryRequestDTO | void>({
      query: (queryParams) => {
        const params = queryParams
          ? Object.entries(queryParams)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([ _, value ]) => value !== undefined && value !== null)
            .map(([ key, value ]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&')
          : '';

        return {
          url: `/campaigns${params ? `?${params}` : ''}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetCompaniesQuery } = companiesApi;
