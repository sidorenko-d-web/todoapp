// import WebApp from '@twa-dev/sdk';

import { init_data } from '../../constants';

export const performSignIn = async (signIn: Function) => {
  return signIn({ init_data }).unwrap();
};
