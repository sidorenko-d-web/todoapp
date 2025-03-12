import ColoredShop from '../assets/icons/colored-shop.svg';
import ColoredIntegrations from '../assets/icons/colored-integrations.svg';
import ColoredHome from '../assets/icons/colored-home.svg';
import ColoredPromotion from '../assets/icons/colored-promotion.svg';
import ColoredTasks from '../assets/icons/colored-tasks.svg';
import FaceYellow from '../assets/icons/face-yellow.svg';

import { AppRoute } from './appRoute';

export const footerItems = [
  {
    id: 0,
    title: 'Профиль',
    icon: FaceYellow,
    redirectTo: AppRoute.Profile,
  },
  {
    id: 1,
    title: 'Магазин',
    icon: ColoredShop,
    redirectTo: AppRoute.Shop,
  },
  {
    id: 2,
    title: 'Интеграции',
    icon: ColoredIntegrations,
    redirectTo: '/integrations/undefined',
  },
  {
    id: 3,
    title: 'Дом',
    icon: ColoredHome,
    redirectTo: AppRoute.Main,
  },
  {
    id: 4,
    title: 'Продвижение',
    icon: ColoredPromotion,
    redirectTo: AppRoute.Promotion,
  },
  {
    id: 5,
    title: 'Задания',
    icon: ColoredTasks,
    redirectTo: AppRoute.Tasks,
  },
];