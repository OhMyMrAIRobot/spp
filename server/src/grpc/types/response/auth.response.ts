export type AuthResponse = {
  accessToken: string;
  user: GrpcUser;
};

export interface GrpcUser {
  id: string;
  username: string;
  role: number;
}

export interface LogoutResponse {}
