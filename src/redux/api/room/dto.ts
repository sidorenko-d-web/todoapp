import { IAchievement, IShopItem } from '../shop';

export type BoostDTO = {
  income_per_second: string;
  subscribers: number;
  views: number;
};

export interface IEquipedRoomResponse {
  items: IShopItem[];
  equipped_items: IRoomItem[];
  achievements: IAchievement[];
}

export interface IRoom {
  id: string;
}

export interface IRoomItem {
  id: string;
  slot: number;
}

export interface IEquipItemRequest {
  equipped_items?: IRoomItem[];
  equipped_achievements?: { id: string, slot: 100 }[];
}
export interface IRemoveItemRequest {
  items_to_remove?: { id: string }[];
  achievements_to_remove?: { id: string }[];
}
