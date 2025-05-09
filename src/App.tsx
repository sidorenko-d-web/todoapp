import { Provider } from 'react-redux';
import { store } from './redux';
import HistoryRouter from './routes/HistoryRoute.tsx';
import browserHistory from './routes/browserHistory.ts';
import AppRouter from './routes/AppRouter.tsx';
import { AuthInit } from './hooks';
import { ModalsProvider } from './providers';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonClientProvider } from './providers/TonClientProvider';
import { TransactionNotificationProvider } from './providers/TransactionNotificationProvider/';

// import CountdownTimer from './components/timer/CountdownTimer.tsx'; // Расскоментить таймер
// import TechWorkPage from './components/TechWorkPage/TechWorkPage'; // Расскоментить страницу с технической работой
declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {

  // // Раскомментить таймер
  // const releaseDate = new Date('2025-03-18T12:00:00+03:00');
  // const now = new Date();
  // if (now < releaseDate) {
  //   return <CountdownTimer />;
  // }

  // Технические работы
  // if (true) {
  //   return <TechWorkPage />;
  // }

  return (
    <>
      <Provider store={store}>
        <ModalsProvider>
          <AuthInit>
            <HistoryRouter history={browserHistory}>
              <TonConnectUIProvider language="ru"
                manifestUrl={'https://raw.githubusercontent.com/TimurZheksimbaev/First-TON-Project/refs/heads/main/apusher-tonconnect-manifest.json'}>
                <TonClientProvider>
                  <TransactionNotificationProvider>
                    <AppRouter />
                  </TransactionNotificationProvider>
                </TonClientProvider>
              </TonConnectUIProvider>
            </HistoryRouter>
          </AuthInit>
        </ModalsProvider>
      </Provider>
    </>
  );
}

export default App;
