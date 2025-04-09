import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { buildLink } from '../../constants/buildMode';
import { setCredentials } from '../slices';
import { AuthTokensResponseDTO, SignInDTO } from './auth';
import { init_data } from '../../constants';

const mutex = new Mutex();

export const baseQuery = fetchBaseQuery({
  baseUrl: buildLink()?.baseUrl, //Тест
  prepareHeaders: headers => {
    const token = localStorage.getItem('access_token');
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
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    // === TODO: REMOVE IN PRODUCTION ===
    if (result.error && result.error.status === 502) {
      result = await baseQuery(args, api, extraOptions);
    }

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const payload: SignInDTO = {
            init_data,
          };

          const refreshResult = await baseQuery(
            {
              url: '/auth/login',
              method: 'POST',
              body: payload,
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            api.dispatch(setCredentials(refreshResult.data as AuthTokensResponseDTO));

            result = await baseQuery(args, api, extraOptions);
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }

    return result;
  }
;
