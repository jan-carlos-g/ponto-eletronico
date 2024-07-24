import "reflect-metadata";
import { PrismaClient } from "@prisma/client";

import { container } from "tsyringe";

import { IUserService } from "../interfaces/userServiceInterface";
import { IWorkLogService } from "../interfaces/workLogServiceInterface";
import { AuthService } from "../services/authService";
import { UserService } from "../services/userService";
import { WorkLogService } from "../services/workLogService";

container.register<PrismaClient>("PrismaClient", {
  useValue: new PrismaClient(),
});
container.register<IUserService>("UserService", { useClass: UserService });
container.register<IWorkLogService>("WorkLogService", {
  useClass: WorkLogService,
});
container.registerSingleton<AuthService>("AuthService", AuthService);
