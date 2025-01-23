import EyeIcon  from '../assets/icons/eye.svg';
import HomeIcon from '../assets/icons/home.svg';
import FlagIcon from '../assets/icons/flag.svg';
import ListIcon from "../assets/icons/list.svg";
import ShopIcon  from "../assets/icons/shop.svg";

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
        redirectTo: AppRoute.Main
    },
    {
        id: 2,
        title: "Дом",
        icon: HomeIcon,
        redirectTo: AppRoute.Main
    },
    {
        id: 3, 
        title: "Продвижение",
        icon: FlagIcon,
        redirectTo: AppRoute.Main
    },
    {
        id: 4, 
        title: "Задания",
        icon: ListIcon,
        redirectTo: AppRoute.Main
    }
]