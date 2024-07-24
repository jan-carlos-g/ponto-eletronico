import { PrismaClient } from "@prisma/client";

import { injectable, inject } from "tsyringe";

import { IUserService } from "../interfaces/userServiceInterface";
import { UserCreateInput } from "../types/userInterface";

@injectable()
export class UserService implements IUserService {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  public async createUser(data: UserCreateInput) {
    try {
      const user = await this.prisma.user.create({
        data,
        select: {
          id: true,
          name: true,
          cod: false,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}
