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

export type PushLineProfileStatus = {
  status_name: string;
  status_name_eng: string;
};

export type PushLineData = {
  current_status: string;
  push_line_profile_status: PushLineProfileStatus;
  in_streak_days: number;
  failed_at: string;
  failed_days_ago: number;
};

export type ReferralDTO = {
  id: number;
  username: string;
  reminded_at: string;
  invited_count: number;
  subscribers_for_referrer: number;
  points_for_referrer: number;
  push_line_data: PushLineData;
};

export type ReferralCodeDTO = {
  referral_code: number;
  referral_id: number;
};

export type NewReferrerRequestDTO = {
  id: number;
  name: string;
  username: string;
  invited_by: number;
  reward_for_invited: number;
};

export type MainStatistics = {
  subscribers_from_first_level: number;
  subscribers_from_second_level: number;
  points_from_first_level: string;
};

export type GetReferralsDTO = {
  count: number;
  main_statistics: MainStatistics;
  referrals: ReferralDTO[];
};
export type IGetReferralsRequest = {
  limit?: number
  offset?: number
};

