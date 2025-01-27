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