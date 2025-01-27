import { Provider } from 'react-redux';
import { store } from './redux';
import HistoryRouter from './routes/HistoryRoute.tsx';
import browserHistory from './routes/browserHistory.ts';
import AppRouter from './routes/AppRouter.tsx';
import { AuthInit } from './hooks';
import { ModalsProvider } from './providers';

declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {

  return (
    <>
      <Provider store={store}>
        <ModalsProvider>
          <AuthInit>
            <HistoryRouter history={browserHistory}>
              <AppRouter />
            </HistoryRouter>
          </AuthInit>
        </ModalsProvider>
      </Provider>
    </>
  )
}

export default App
