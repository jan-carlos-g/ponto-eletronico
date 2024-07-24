export interface JwtPayload {
  id: number;
}
export interface AuthResponse {
  userId: user.id;
  token: string;
  name: string;
}
