import { Action, combineReducers } from 'redux';
import {
  animationStateReducer,
  audioReducer,
  authReducer,
  mainReducer,
  shopReducer,
  transactionNotificationReducer,
} from './slices';
import {
  authApi,
  chestApi,
  companiesApi,
  integrationsApi,
  profileApi,
  pushLineApi,
  referralsApi,
  roomApi,
  shopApi,
  trackingApi,
  treeApi,
  usersApi,
} from './api';

import { tasksApi } from './api/tasks';
import { treeReducer } from './slices/tree.ts';
import confirmationReducer from './slices/confirmation.ts';

import guideReducer from './slices/guideSlice.ts';
import { confirmationsApi } from './api/confirmations/api.ts';
import { characterApi } from './api/character/api.ts';
import accelerationReducer from './slices/integrationAcceleration.ts';

const appReducer = combineReducers({
  auth: authReducer,
  guide: guideReducer,
  treeSlice: treeReducer,
  mainSlice: mainReducer,
  shop: shopReducer,
  audioSlice: audioReducer,
  confirmation: confirmationReducer,
  acceleration: accelerationReducer,
  animationStateSlice: animationStateReducer,
  transactionNotification: transactionNotificationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [pushLineApi.reducerPath]: pushLineApi.reducer,
  [trackingApi.reducerPath]: trackingApi.reducer,
  [characterApi.reducerPath]: characterApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [referralsApi.reducerPath]: referralsApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [confirmationsApi.reducerPath]: confirmationsApi.reducer,
  [chestApi.reducerPath]: chestApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('access_token');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
