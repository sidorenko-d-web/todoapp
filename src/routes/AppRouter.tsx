import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage.tsx';
import { AppRoute } from '../constants';
import { IntegrationPage } from '../pages';
import { TasksPage } from '../pages';
import { PromotionPage } from '../pages';


function AppRouter(): JSX.Element | null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path={AppRoute.Main} element={<MainPage />} />
      <Route path={AppRoute.Integration} element={<IntegrationPage/>} />
      <Route path={AppRoute.Tasks} element={<TasksPage />} />
      <Route path={AppRoute.Promotion} element={<PromotionPage />} />
    </Routes>
  );
}

export default AppRouter;