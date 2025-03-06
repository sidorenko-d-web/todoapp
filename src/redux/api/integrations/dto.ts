export type IntegrationResponseDTO = {
  campaign_id: string;
  content_type: string;
  user_profile_id: string;
  id: string;
  status: string;
  time_left: number;
  income: string;
  views: number;
  subscribers: number;
  future_statistics: FutureStatisticsDTO
  comments_generated: number;
  comments_answered: number;
  comments_answered_correctly: number;
  genre_id: number;
  number: number;
  published_at: string;
  created_at: string;
  updated_at: string;

  base_income: string;
  base_views: number;
  base_subscribers: number;

  campaign: {
    company_name: string;
    image_url: string;
    id: string;
  };
};

export type FutureStatisticsDTO = {
  income: string
  views: number
  subscribers: number
}

export type IntegrationsResponseDTO = {
  count: number;
  integrations: IntegrationResponseDTO[];
};

export type IntegrationsQueryRequestDTO = {
  company_name?: string;
  status?: 'creating' | 'created' | 'published';
  asc?: boolean;
  offset?: number;
  limit?: number;
};

export type UnansweredIntegrationCommentDTO = {
  id: string;
  author_username: string;
  comment_text: string;
  is_hate: boolean;
};

export type CreateIntegrationRequestDTO = {
  campaign_id: string;
  content_type: string;
};

export type CreateIntegrationCommentDTO = {
  is_hate: boolean;
};

export interface IntegrationUpdateRequestDTO {
  integrationId: string;
  timeLeftDelta: number;
}
