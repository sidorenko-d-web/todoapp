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
  created_at: string;
  updated_at: string;
  campaign: {
    company_name: string;
    image_url: string;
    id: string;
  };
};

export type IntegrationsResponseDTO = {
  count: number
  integrations: IntegrationResponseDTO[];
};

export type IntegrationsQueryRequestDTO = {
  company_name?: string;
  status?: 'creating' | 'created';
  asc?: boolean;
  offset?: number;
  limit?: number;
}

export type UnansweredIntegrationCommentDTO = {
  id: string,
  author_username: string,
  comment_text: string,
}


export type CreateIntegrationRequestDTO = {
  campaign_id: string;
  content_type: string
}

export type CreateIntegrationCommentDTO = {
  is_hate: boolean
}

export interface IntegrationUpdateRequestDTO {
  integrationId: string;
  timeLeftDelta: number;
}
