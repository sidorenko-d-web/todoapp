export type UserProfileInfoResponseDTO = {
    blog_name: string;
    username: string;
    points: string;
    total_earned: string;
    id: string;
    subscription_integrations_left: number;
    subscribers: number;
    total_views: number;
    comments_answered_correctly: number;
}

export type TopProfilesResponseDTO = {
    count: number;
    profiles: UserProfileInfoResponseDTO[];
};

export type UpdateProfileRequestDTO = {
    blog_name: string;
    username: string;
  }