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
  is_bought: boolean;
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

export type TypeWearLocation = 'head' | 'face' | 'upper_body' | 'legs' | 'skin_color' | 'entire_body';
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
  is_bought?: boolean;
}

export interface IInventoryItemsRequest {
  item_categories?: TypeItemCategory[];
  limit?: number;
  offset?: number;
  asc?: boolean;
  level?: number;
  name?: string;
  name_eng?: string;
  item_rarity?: TypeItemRarity;
  item_premium_level?: TypeItemQuality;
  is_bought?: boolean;
}

export interface IBoosts {
  views: string;
  income_per_second: string;
  subscribers: number;
}

export type Reward_range = {
  points: string[];
  subscribers: number[];
  freezes: number[];
  subscriptions: number[];
}

export type Chest = {
  id: string;
  chest_name: string;
  chest_name_eng: string;
  reward_range: Reward_range;
  days_in_streak_list: number[];
  item_levels_to_give: number[];
  chest_image_url: string;
}

export type UpgradeItemResponse = {
  name: string;
  item_category: string;
  item_rarity: string;
  item_premium_level: string;
  depends: string;
  level: number;
  price_internal: string;
  price_usdt: string;
  boost: IBoosts;
  image_url: string;
  is_reward_given: boolean;
  name_eng: string;
  id: string;
}

export interface IBuyItemRequest {
  payment_method: 'internal_wallet' | 'usdt';
  id: string;
  transaction_id?: string
  sender_address?: string
}

export interface IAchievementBoost {
  income_per_second: string;
}

export interface IAchievement {
  id: string;
  name: string;
  name_eng: string;
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

export interface IAchievementsRequest {
  is_unlocked?: boolean;
  ids?: string[];
  name?: string;
  total_integrations?: string;
  level?: string;
  company_name?: string;
  is_precious_drop?: boolean;
  is_growth_tree_achievement?: boolean;
  order_by?: string;
  asc?: boolean;
  offset?: number;
  limit?: number;
}
