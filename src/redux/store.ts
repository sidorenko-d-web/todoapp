import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import {
  authApi,
  companiesApi,
  integrationsApi,
  inventoryApi,
  profileApi,
  referralsApi,
  roomApi,
  shopApi,
  trackingApi,
  treeApi,
  usersApi,
  pushLineApi,
  confirmationsApi,
} from './api';
import { tasksApi } from './api/tasks';
import { characterApi } from './api/character';

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
      referralsApi.middleware,
      pushLineApi.middleware,
      usersApi.middleware,
      treeApi.middleware,
      trackingApi.middleware,
      tasksApi.middleware,
      roomApi.middleware,
      pushLineApi.middleware,
      confirmationsApi.middleware,
      characterApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
