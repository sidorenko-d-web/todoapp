import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import {
  authApi,
  companiesApi,
  integrationsApi,
  inventoryApi,
  profileApi,
  refferalsApi,
  roomApi,
  shopApi,
  trackingApi,
  treeApi,
  usersApi,
} from './api';
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
      trackingApi.middleware,
      tasksApi.middleware,
      roomApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;