export type UserProfileInfoResponseDTO = {
    blog_name: string;
    username: string;
    points: string;
    total_earned: string;
    growth_tree_stage_id: number;
    subscribers_for_first_level_referrals: number;
    subscribers_for_second_level_referrals: number;
    id: string;
    subscription_integrations_left: number;
    subscribers: number;
    total_views: number;
    future_statistics: FutureStatistics;
    comments_answered_correctly: number;
    achievements_collected: number;
    is_vip: boolean;
    updated_at: string;
    email?: string;
    phone_number?: string;
}

export type FutureStatistics = {
    points: string;
    subscribers: number;
    total_views: number;
    total_earned: string;
}

export type TopProfilesResponseDTO = {
    count: number;
    profiles: UserProfileInfoResponseDTO[];
};

export type UpdateProfileRequestDTO = {
    blog_name: string;
    username: string;
  }