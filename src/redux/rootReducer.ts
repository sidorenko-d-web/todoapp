import { Action, combineReducers } from 'redux';
import { audioReducer, authReducer } from './slices';
import {
  authApi,
  companiesApi,
  integrationsApi,
  profileApi,
  refferalsApi,
  roomApi,
  shopApi,
  trackingApi,
  treeApi,
  usersApi,
  pushLineApi
} from './api';

import { tasksApi } from './api/tasks';
import { treeReducer } from './slices/tree.ts';
import confirmationReducer from './slices/confirmation.ts';

import guideReducer from './slices/guideSlice.ts';
import { pointsReducer } from './slices/point.ts';
import { confirmationsApi } from './api/confirmations/api.ts';

const appReducer = combineReducers({
  auth: authReducer,
  treeSlice: treeReducer,
  guide: guideReducer,
  audioSlice: audioReducer,
  pointSlice: pointsReducer,
  confirmation: confirmationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [pushLineApi.reducerPath]: pushLineApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [refferalsApi.reducerPath]: refferalsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
  [trackingApi.reducerPath]: trackingApi.reducer,
  [confirmationsApi.reducerPath]: confirmationsApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
