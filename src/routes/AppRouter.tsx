import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppRoute } from '../constants';

import {
  IntegrationPage,
  MainPage,
  ProfilePage,
  ProgressTreePage,
  PromotionPage,
  StatisticsPage,
  StrangerProfilePage,
  StrangerRoomPage,
  TasksPage,
  WardrobePage,
} from '../pages';
import Layout from '../layout/Layout.tsx';

import DevModals from '../pages/DevModals/DevModals.tsx';
import { ShopInventoryPage, ShopPage } from '../pages/ShopPage';

function AppRouter(): JSX.Element | null {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={AppRoute.Wardrobe} element={<WardrobePage key={AppRoute.Wardrobe} />} />
          <Route path={AppRoute.Shop} element={<ShopPage />} />
          <Route path={AppRoute.Integration} element={<IntegrationPage />} />
          <Route path={AppRoute.Statistics} element={<StatisticsPage />} />
          <Route path={AppRoute.Tasks} element={<TasksPage />} />
          <Route path={AppRoute.Profile} element={<ProfilePage />} />
          <Route path={AppRoute.StrangerProfile} element={<StrangerProfilePage />} />
          <Route path={AppRoute.StrangerProfileRoom} element={<StrangerRoomPage />} />
          <Route path={AppRoute.Promotion} element={<PromotionPage />} />
          <Route path={AppRoute.ShopInventory} element={<ShopInventoryPage />} />
          <Route path={'dev-modals'} element={<DevModals />} />
          <Route path={AppRoute.ProgressTree} element={<ProgressTreePage />} />
          <Route path={AppRoute.Main} element={<MainPage key={AppRoute.Main} />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRouter;
