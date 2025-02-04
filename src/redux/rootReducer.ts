import { Action, combineReducers } from 'redux';
import { authReducer } from './slices';
import { authApi, companiesApi, integrationsApi, profileApi, treeApi, usersApi } from './api';
import { shopApi } from './api';
import { inventoryApi } from './api/inventory/api';
import { refferalsApi } from './api';
import { treeReducer } from './slices/tree.ts';

const appReducer = combineReducers({
  auth: authReducer,
  treeSlice: treeReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [refferalsApi.reducerPath]: refferalsApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [treeApi.reducerPath]: treeApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};