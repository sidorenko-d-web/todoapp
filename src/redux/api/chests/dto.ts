export type ChestRewardRequestDTO = {
    chest_reward_reason: 'push_line' | 'profile_rating' | 'create_channel_assignment';
};

export type ChestRewardResponseDTO = {
    chest_id: string;
    profile_id: string;
    chest_reward_reason: 'push_line' | 'profile_rating' | 'create_channel_assignment';
    reward: Record<string, number>;
    chest_name: string;
    chest_image_url: string;
};
