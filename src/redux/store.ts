import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { authApi, companiesApi } from './api';
import { shopApi } from './api/shop/api';
import { inventoryApi } from './api/inventory/api';
import { integrationsApi } from './api';
import { profileApi } from './api';
import { refferalsApi } from './api/referrals/api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      shopApi.middleware,
      inventoryApi.middleware,
      integrationsApi.middleware,
      profileApi.middleware,
      companiesApi.middleware,
      refferalsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;