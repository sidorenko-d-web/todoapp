export type PushLineDTO = {
  status: string;
  in_streak_days: number;
  next_reward: string;
  days_for_next_reward: number;
  failed_at: string;
  failed_days_ago: number;
  week_information: {
    date: string;
    status: string;
    is_notified_at_morning: boolean;
    is_notified_at_afternoon: boolean;
    is_notified_at_evening: boolean;
    is_notified_at_late_evening: boolean;
    is_notified_at_night: boolean;
    is_notified_at_late_night: boolean;
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
