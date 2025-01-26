import { Action, combineReducers } from 'redux';
import { authReducer } from './slices';
import { authApi } from './api';
import { integrationsApi } from './api/integrations/api';
import { profileApi } from './api/profile/api';

const appReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
});

export const rootReducer = (state: any, action: Action) => {
  if (action.type === 'auth/signOut') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};