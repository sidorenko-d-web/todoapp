import { Action, combineReducers } from 'redux';
import { authReducer } from './slices';
import { authApi } from './api';
import { shopApi } from './api/shop/api';
import { inventoryApi } from './api/inventory/api';

const appReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [shopApi.reducerPath]: shopApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};