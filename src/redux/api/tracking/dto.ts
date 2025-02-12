export type PostEventRequestBody = {
  event: string
  description: string
}

export type PostEventResponse = {
  event: string;
  description: string;
  profile_id: string;
  growth_tree_stage: number;
  id: string;
}