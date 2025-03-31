export type SignInDTO = {
  init_data: string;
};

export type SignInResponseDTO = {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  token_type: string;
};
