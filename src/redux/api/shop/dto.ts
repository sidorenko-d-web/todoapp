export interface IShopItem {
  id: string;
  name: string;
  item_category: TypeItemCategory;
  level: number;
  price_internal: string;
  item_rarity: TypeItemRarity;
  depends: string;
  price_usdt: string;
  boost: IBoosts;
  image_url: string;
}

export interface IShopItemsResponse {
  count: number;
  items: IShopItem[];
}
export interface IShopSkin {
  id: string;
  name: string;
  wear_location: TypeWearLocation;
  limited: boolean;
  quantity: number;
  level: number;
  price_internal: string;
  price_usdt: string;
  image_url: string;
}

export interface IShopSkinsResponse {
  count: number;
  skins: IShopSkin[];
}

export type TypeWearLocation = 'head' | 'face' | 'upper_body' | 'legs' | 'feet' | 'entire_body';
export type TypeItemCategory = 'text' | 'image' | 'video' | 'decor';
export type TypeItemQuality = 'lowcost' | 'prem' | 'lux';
export type TypeItemRarity = 'red' | 'yellow' | 'green';

export interface IShopItemsRequest {
  item_category?: TypeItemCategory;
  limit?: number;
  offset?: number;
  asc?: boolean;
  level?: number;
  name?: string
  item_rarity?: TypeItemRarity
}

export interface IBoosts {
  views: string;
  income_per_second: string;
  subscribers: number;
}
export interface IBuyItemRequest {
  payment_method: 'internal_wallet';
  id: string;
}
