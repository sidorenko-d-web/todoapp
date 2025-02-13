export type TaskBoost = {
  income_per_second: string;
  subscribers: number;
  views: number;
}

export type TaskCategory = 'subscribe' | 'create_channel' | 'post' | 'daily';

export type Task = {
  title: string;
  description: string;
  stages: number;
  boost: TaskBoost;
  image_url: string;
  category: TaskCategory;
  external_link: string;
  id: string;
  is_completed: boolean;
  completed_stages: number;
  link: string;
}

export type GetTasksResponse = {
  count: number;
  assignments: Task[];
}

export type UpdateTaskRequest = {
  completed_stages: number;
  link: string;
}

export type UpdateTaskResponse = Task;

export type AnswerOption = {
  id: string;
  answer_text: string;
  is_correct: boolean;
}

export type Question = {
  id: string;
  question_text: string;
  answer_options: AnswerOption[];
}

export type GetTaskQuestionsResponse = Question[];

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
