import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppRoute } from '../constants';

import ShopPage from '../pages/ShopPage/ShopPage.tsx';
import { IntegrationPage } from '../pages';
import { TasksPage } from '../pages';
import { PromotionPage } from '../pages';
import { ProfilePage } from '../pages';
import { MainPage } from '../pages';
import Layout from '../layout/Layout.tsx';
import StatisticsPage from '../pages/StatisticsPage/StatisticsPage';

import DevModals from '../pages/DevModals/DevModals.tsx';
import { ShopInvewntoryPage } from '../pages/ShopPage';

function AppRouter(): JSX.Element | null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ location.pathname ]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={AppRoute.Main} element={<MainPage />} />
        <Route path={AppRoute.Shop} element={<ShopPage />} />
        <Route path={AppRoute.Integration} element={<IntegrationPage/>} />
        <Route path={AppRoute.Integrations} element={<StatisticsPage />} />
        <Route path={AppRoute.Tasks} element={<TasksPage />} />
        <Route path={AppRoute.Profile} element={<ProfilePage />} />
        <Route path={AppRoute.Promotion} element={<PromotionPage />} />
        <Route path={AppRoute.ShopInventory} element={<ShopInvewntoryPage />} />
        <Route path={'dev-modals'} element={<DevModals />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;

