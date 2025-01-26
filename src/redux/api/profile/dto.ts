export type UserProfileInfoResponseDTO = {
    blog_name: string;
    username: string;
    points: string;
    total_earned: string;
    id: string;
    subscription_integrations_left: number;
    subscribers: number;
    total_views: number;
    comments_answered: number;
}

export type TopProfilesResponseDTO = {
    count: number;
    profiles: UserProfileInfoResponseDTO[];
};