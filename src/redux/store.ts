import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import {authApi} from './api';
import { integrationsApi } from './api/integrations/api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      integrationsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;