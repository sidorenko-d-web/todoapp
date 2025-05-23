export type PushLineDTO = {
  current_status: string;
  in_streak_days: number;
  next_reward: string;
  days_for_next_reward: number;
  failed_at: string;
  failed_days_ago: number;
  push_line_profile_status: {
    id: string;
    status_name: string;
    status_name_eng: string;
    days_in_streak: number;
  };
  next_chest: {
    id: string,
    chest_name: string,
    chest_name_eng: string
  },

  week_information: {
    creation_date: string;
    push_line_data: PushLineDateDTO
  }[];
};

export type PushLineDateDTO = {
  date: string;
  status: string;
  is_notified_at_morning: boolean;
  is_notified_at_afternoon: boolean;
  is_notified_at_evening: boolean;
  is_notified_at_late_evening: boolean;
  is_notified_at_night: boolean;
  is_notified_at_late_night: boolean;
};
