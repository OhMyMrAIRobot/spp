export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = LoginRequest;

export type RefreshRequest = {
  refreshToken: string;
};

export type LogoutRequest = {};
