export type SignInDTO = {
  init_data: string;
};

export type RefreshTokensDTO = {
  refresh_token: string;
};

export type AuthTokensResponseDTO = {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  token_type: string;
};
