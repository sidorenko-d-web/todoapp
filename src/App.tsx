import { Provider } from 'react-redux';
import { store } from './redux';
import HistoryRouter from './routes/HistoryRoute.tsx';
import browserHistory from './routes/browserHistory.ts';
import AppRouter from './routes/AppRouter.tsx';
import { AuthInit} from './hooks';
import { ModalsProvider } from './providers';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonClientProvider } from './providers/TonClientProvider';
import { useMemo } from 'react';


declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);
  return (
    <>
      <Provider store={store}>
        <ModalsProvider>
          <AuthInit>
            <HistoryRouter history={browserHistory}>
              <TonConnectUIProvider manifestUrl={manifestUrl}>
                <TonClientProvider>
                  <AppRouter />
                </TonClientProvider>
              </TonConnectUIProvider>
            </HistoryRouter>
          </AuthInit>
        </ModalsProvider>
      </Provider>
    </>
  )
}

export default App
