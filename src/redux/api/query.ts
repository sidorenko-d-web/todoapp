import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';

import type { RootState } from '../store';
import { setCredentials, signOut } from '../slices';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://bbajd7fltqec6462cm1j.containers.yandexcloud.net',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    headers.set('X-Authorization', token || '');
    return headers;
  },
});

export const baseQueryReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // === TODO: REMOVE IN PRODUCTION ===
  if (result.error && result.error.status === 502) {
    result = await baseQuery(args, api, extraOptions);
  }

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(signOut());
      return result;
    }

    const refreshResult = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_DOMAIN,
    })(
      {
        url: '/auth/refresh',
        method: 'PATCH',
        body: { refresh_token: refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(signOut());
    }
  }

  return result;
};