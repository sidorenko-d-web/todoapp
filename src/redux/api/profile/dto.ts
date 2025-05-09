import { IAchievement } from '../shop';

export type UserProfileInfoResponseDTO = {
  blog_name: string;
  username: string;
  points: string;
  favorite_company: string;
  total_earned: string;
  growth_tree_stage_id: number;
  days_in_streak: number;
  subscribers_for_first_level_referrals: number;
  subscribers_for_second_level_referrals: number;
  next_subscription_at: string | null;
  id: string;
  subscription_integrations_left: number;
  subscribers: number;
  total_views: number;
  future_statistics: FutureStatistics;
  comments_answered_correctly: number;
  available_freezes: number;
  achievements_collected: number;
  is_vip: boolean;
  updated_at: string;
  email?: string;
  phone_number?: string;
  achievements: IAchievement[];
};

export type FutureStatistics = {
  points: string;
  subscribers: number;
  total_views: number;
  total_earned: string;
};

export type TopProfilesResponseDTO = {
  count: number;
  profiles: UserProfileInfoResponseDTO[];
};
export type ITopProfilesInfoRequest = {
  ids?: string[];
};

export type UpdateProfileRequestDTO = {
  blog_name: string;
  username: string;
};

export type BuySubscriptionRequestDTO = {
  payment_method: 'internal_wallet' | 'usdt' | string;
  transaction_id?: string;
  sender_address?: string;
};
