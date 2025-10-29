export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: GrpcUser;
};

export interface GrpcUser {
  id: string;
  username: string;
  role: number;
}

export interface LogoutResponse {}
