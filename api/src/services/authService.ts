import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { injectable, inject } from "tsyringe";

import { IAuthService } from "../interfaces/authServiceInterface";
import { AuthResponse } from "../types/auth";

@injectable()
export class AuthService implements IAuthService {
  private jwtSecret: string = process.env.JWT_SECRET || "your_secret_key";

  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  public async authenticateUser(cod: string): Promise<AuthResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          cod: cod,
        },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const token = this.generateToken(user.id);
      const authUser = {
        userId: user.id,
        token: token,
        name: user.name,
      };
      console.log("Usuário", authUser);
      return authUser;
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      throw new Error(`Erro de autenticação: ${error.message}`);
    }
  }

  private generateToken(userId: number): string {
    const payload = { id: userId };
    const options = { expiresIn: "8h" };

    const token = jwt.sign(payload, this.jwtSecret, options);

    return token;
  }
}
