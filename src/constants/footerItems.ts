import { EyeIcon }  from '../assets/icons/eye';
import { HomeIcon } from '../assets/icons/home';
import { FlagIcon } from '../assets/icons/flag';
import { ListIcon } from "../assets/icons/list";
import { ShopIcon }  from "../assets/icons/shop";

import { AppRoute } from './appRoute';

// TODO: 
// поменять все redirectTo на правильные

export const footerItems = [
    {
        id: 0,
        title: "Магазин",
        icon: ShopIcon,
        redirectTo: AppRoute.Main
    },
    {
        id: 1, 
        title: "Интеграции",
        icon: EyeIcon,
        redirectTo: AppRoute.integrations
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