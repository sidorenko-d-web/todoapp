import { Action, combineReducers } from 'redux';
import { audioReducer, authReducer } from './slices';
import { authApi, companiesApi, integrationsApi, profileApi, treeApi, usersApi, roomApi } from './api';
import { shopApi } from './api';
import { refferalsApi } from './api';
import { treeReducer } from './slices/tree.ts';
import { tasksApi } from './api/tasks';
import guideReducer from './slices/guideSlice.ts';
import { pointsReducer } from './slices/point.ts';

const appReducer = combineReducers({
  auth: authReducer,
  treeSlice: treeReducer,
  guide: guideReducer,
  audioSlice: audioReducer,
  pointSlice: pointsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [refferalsApi.reducerPath]: refferalsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};