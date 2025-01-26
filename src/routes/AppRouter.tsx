import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage.tsx';
import { AppRoute } from '../constants';
import { IntegrationPage } from '../pages/index.ts';
import { TasksPage } from '../pages/index.ts';
import { ProfilePage } from '../pages/index.ts';


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
      <Route path={AppRoute.Profile} element={<ProfilePage/>}/>
    </Routes>
  );
}

export default AppRouter;