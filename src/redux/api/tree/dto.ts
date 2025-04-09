export type Boost = {
  points: string;
  subscribers: number;
  income_per_second?: string;
  x_income_per_second?: string;
  additional_integrations_for_subscription: number;
  subscribers_for_first_level_referrals: number;
  subscribers_for_second_level_referrals: number;
  freezes: number;
}

export type Achievement = {
  name: string;
  company_name: string;
  total_integrations: number;
  level: number;
  boost: Boost;
  image_url: string;
  is_unlocked: boolean;
  id: string;
  is_available: boolean;
}

export type GrowthTreeStage = {
  id: number;
  stage_number: number;
  subscribers: number;
  achievement: Achievement;
};

export type GrowthTreeResponse = {
  count: number;
  growth_tree_stages: GrowthTreeStage[];
};
