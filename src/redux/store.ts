import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { authApi, companiesApi, treeApi, usersApi } from './api';
import { shopApi } from './api';
import { inventoryApi } from './api/inventory/api';
import { integrationsApi } from './api';
import { profileApi } from './api';
import { refferalsApi } from './api';
import { tasksApi } from './api/tasks';

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
      usersApi.middleware,
      treeApi.middleware,
      tasksApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;