export type TaskBoost = {
  income_per_second: string;
  subscribers: number;
  views: number;
}

export type TaskCategory = 'subscribe' | 'create_channel' | 'post' | 'other';

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
