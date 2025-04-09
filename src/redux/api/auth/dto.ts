export type SignInDTO = {
  init_data: string;
};

export type AuthTokensResponseDTO = {
  access_token: string;
  expires_at: string;
  token_type: string;
};
