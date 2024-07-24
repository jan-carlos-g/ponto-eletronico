import { AuthResponse } from "../types/auth";

export interface IAuthService {
  authenticateUser(cod: string): Promise<AuthResponse>;
}
