export interface IShopItem {
  id: string;
  name: string;
  name_eng: string;
  item_category: TypeItemCategory;
  level: number;
  price_internal: string;
  item_rarity: TypeItemRarity;
  depends: string;
  price_usdt: string;
  boost: IBoosts;
  image_url: string;
  item_premium_level: TypeItemQuality;
}

export interface IShopItemsResponse {
  count: number;
  items: IShopItem[];
}
export interface IShopSkin {
  id: string;
  name: string;
  name_eng: string;
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

export type TypeWearLocation = 'head' | 'face' | 'upper_body' | 'legs' | 'skin_color' | 'entire_body' | 'feet';
export type TypeItemCategory = 'text' | 'image' | 'video' | 'decor';
export type TypeItemQuality = 'base' | 'advanced' | 'pro';
export type TypeItemRarity = 'red' | 'yellow' | 'green';

export interface IShopItemsRequest {
  item_category?: TypeItemCategory;
  limit?: number;
  offset?: number;
  asc?: boolean;
  level?: number;
  name?: string;
  name_eng?: string;
  item_rarity?: TypeItemRarity;
  item_premium_level?: TypeItemQuality;
}

export interface IBoosts {
  views: string;
  income_per_second: string;
  subscribers: number;
}
export interface IBuyItemRequest {
  payment_method: 'internal_wallet' | 'usdt';
  id: string;
}

export interface IAchievementBoost {
  income_per_second: string;
}

export interface IAchievement {
  id: string;
  name: string;
  company_name: string;
  total_integrations: number;
  level: number;
  boost: IAchievementBoost;
  image_url: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
}

export interface IAchievementsResponse {
  count: number;
  achievements: IAchievement[];
}
