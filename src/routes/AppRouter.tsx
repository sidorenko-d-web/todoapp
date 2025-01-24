import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage.tsx';
import { AppRoute } from '../constants';
import StorePage from '../pages/StorePage/StorePage.tsx';

function AppRouter(): JSX.Element | null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path={AppRoute.Main} element={<MainPage />} />
      <Route path={AppRoute.Store} element={<StorePage />} />
    </Routes>
  );
}

export default AppRouter;
