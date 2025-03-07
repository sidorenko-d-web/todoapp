export type TaskBoost = {
  income_per_second: string;
  subscribers: number;
  views: number;
}

export type TaskCategory = 'subscribe' | 'create_channel' | 'post' | 'daily' | 'quiz';

export type StageDescription = {
  [key: string]: {
    ENG: string;
    RUS: string;
  }
}

export type ChestRewardRange = {
  [key: string]: [number, string];
}

export type Chest = {
  id: string;
  chest_name: string;
  reward_range: ChestRewardRange;
  days_in_streak_list: number[];
  chest_image_url: string;
}

export type Question = {
  id: string;
  question_text: string;
  question_text_eng: string;
  answer_options: {
    id: string;
    answer_text: string;
    answer_text_eng: string;
    is_correct: boolean;
  }[];
}

export type Task = {
  title: string;
  description: string;
  title_eng: string;
  description_eng: string;
  stages: number;
  stages_description: StageDescription;
  number: number;
  boost: TaskBoost;
  image_url: string;
  category: TaskCategory;
  external_link: string;
  external_link_eng: string;
  id: string;
  chest?: Chest;
  questions?: Question[];
  is_completed: boolean;
  completed_stages: number;
  link: string;
  is_reward_given: boolean;
}

export type GetTasksResponse = {
  count: number;
  assignments: Task[];
}

export type UpdateTaskRequest = {
  completed_stages: number;
  link: string;
  question_id?: string;
  answer_option_id?: string;
}

export type UpdateTaskResponse = Task;

export type AnswerOption = {
  id: string;
  answer_text: string;
  is_correct: boolean;
}

export type ErrorDetail = {
  loc: [string, number];
  msg: string;
  type: string;
}

export type ErrorResponse = {
  detail: ErrorDetail[];
}

export enum DailyTaskError {
  ASSIGNMENT_NOT_FOUND = 'AssignmentNotFound',
  ASSIGNMENT_IS_NOT_DAILY = 'AssignmentIsNotDaily',
  DAILY_ASSIGNMENT_IS_NOT_ACTUAL = 'DailyAssignmentIsNotActual',
  PROFILE_ASSIGNMENT_IS_NOT_YET_COMPLETED = 'ProfileAssignmentIsNotYetCompleted',
  PROFILE_ASSIGNMENT_REWARD_IS_ALREADY_GIVEN = 'ProfileAssignmentRewardIsAlreadyGiven'
}

export type GetDailyRewardResponse = ErrorResponse;

// Новые типы для ошибок вопросов
export enum DailyQuestionsError {
  ASSIGNMENT_NOT_FOUND = 'AssignmentNotFound',
  ASSIGNMENT_IS_NOT_DAILY = 'AssignmentIsNotDaily',
  DAILY_ASSIGNMENT_IS_NOT_ACTUAL = 'DailyAssignmentIsNotActual'
}

export type GetTaskQuestionsErrorResponse = ErrorResponse;

export type DailyQuestionAnswerOption = {
  id: string;
  answer_text: string;
  is_correct: boolean;
}

export type DailyQuestion = {
  id: string;
  question_text: string;
  answer_options: DailyQuestionAnswerOption[];
}

export type GetTaskQuestionsResponse = DailyQuestion[];
