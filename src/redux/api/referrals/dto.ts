export type CharacterData = {
    head_skin_id: string;
    face_skin_id: string;
    upper_body_skin_id: string;
    legs_skin_id: string;
    feet_skin_id: string;
    skin_color: string;
    gender: string;
    vip_skin_id: string;
    id: string;
    profile_id: string;
};

export type WeekInformation = {
    date: string;
    status: string;
    is_notified_at_morning: boolean;
    is_notified_at_afternoon: boolean;
    is_notified_at_evening: boolean;
    is_notified_at_late_evening: boolean;
    is_notified_at_night: boolean;
    is_notified_at_late_night: boolean;
};

export type PushLineData = {
    status: string;
    in_streak_days: number;
    next_reward: string;
    days_for_next_reward: number;
    failed_at: string;
    failed_days_ago: number;
    week_information: WeekInformation[];
};

export type ReferralDTO = {
    username: string;
    total_invited: number;
    character_data: CharacterData;
    push_line_data: PushLineData;
};

export type ReferralCodeDTO = {
    referral_code: number
    referral_id: number
}

export type NewReferrerRequestDTO = {
    id: number
    name: string
    username: string
    invited_by: number
    reward_for_invited: number
}

export type GetReferralsDTO = {
    referrals: ReferralDTO[];
}