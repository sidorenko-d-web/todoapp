import { EyeIcon }  from '../assets/Icons/eye';
import { HomeIcon } from '../assets/Icons/home';
import { FlagIcon } from '../assets/Icons/flag';
import { ListIcon } from "../assets/Icons/list";
import { ShopIcon }  from "../assets/Icons/shop";

import { AppRoute } from './appRoute';

// TODO: 
// поменять все redirectTo на правильные

export const footerItems = [
    {
        id: 0,
        title: "Магазин",
        icon: ShopIcon,
        redirectTo: AppRoute.Shop
    },
    {
        id: 1, 
        title: "Интеграции",
        icon: EyeIcon,
        redirectTo: AppRoute.Integrations
    },
    {
        id: 2,
        title: "Дом",
        icon: HomeIcon,
        redirectTo: AppRoute.Main // поменять ?
    },
    {
        id: 3, 
        title: "Продвижение",
        icon: FlagIcon,
        redirectTo: AppRoute.Main // поменять
    },
    {
        id: 4, 
        title: "Задания",
        icon: ListIcon,
        redirectTo: AppRoute.Tasks
    }
]