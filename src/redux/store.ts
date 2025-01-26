import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import {authApi} from './api';
import { integrationsApi } from './api/integrations/api';
import { profileApi } from './api/profile/api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      integrationsApi.middleware,
      profileApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;