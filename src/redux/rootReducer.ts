import { Action, combineReducers } from 'redux';
import { audioReducer, authReducer } from './slices';
import {
  authApi,
  companiesApi,
  integrationsApi,
  profileApi,
  referralsApi,
  roomApi,
  shopApi,
  trackingApi,
  treeApi,
  usersApi,
  pushLineApi,
} from './api';

import { tasksApi } from './api/tasks';
import { treeReducer } from './slices/tree.ts';
import confirmationReducer from './slices/confirmation.ts';

import guideReducer from './slices/guideSlice.ts';
import { pointsReducer } from './slices/point.ts';
import { confirmationsApi } from './api/confirmations/api.ts';
import { characterApi } from './api/character/api.ts';
import accelerationReducer from './slices/integrationAcceleration.ts';

const appReducer = combineReducers({
  auth: authReducer,
  treeSlice: treeReducer,
  guide: guideReducer,
  audioSlice: audioReducer,
  pointSlice: pointsReducer,
  confirmation: confirmationReducer,
  acceleration: accelerationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [pushLineApi.reducerPath]: pushLineApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [referralsApi.reducerPath]: referralsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
  [trackingApi.reducerPath]: trackingApi.reducer,
  [confirmationsApi.reducerPath]: confirmationsApi.reducer,
  [characterApi.reducerPath]: characterApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
