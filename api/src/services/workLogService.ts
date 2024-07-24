import { PrismaClient, WorkLog, ActiveSession } from "@prisma/client";

import { injectable, inject } from "tsyringe";

import { IWorkLogService } from "../interfaces/workLogServiceInterface";
import { WorkLogCreateInput } from "../types/workLogInterface";

@injectable()
export class WorkLogService implements IWorkLogService {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  public async createWorkLog(data: WorkLogCreateInput): Promise<WorkLog> {
    try {
      const workLog = await this.prisma.workLog.create({ data });
      return workLog;
    } catch (error) {
      console.error("Error ao criar registro:", error);
      throw error;
    }
  }

  public async getWorkLogsByUser(userId: number): Promise<WorkLog[]> {
    const idNumber = Number(userId);
    try {
      const workLogs = await this.prisma.workLog.findMany({
        where: { userId: idNumber },
        orderBy: { date: "desc" },
        take: 7,
      });

      return workLogs;
    } catch (error) {
      console.error("Erro o buscar datas anteriores", error);
      throw error;
    }
  }

  public async updateWorkLog(
    userId: number,
    date: Date,
    additionalHours: number,
  ): Promise<WorkLog> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingLog = await this.prisma.workLog.findFirst({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (existingLog) {
        const updatedLog = await this.prisma.workLog.update({
          where: { id: existingLog.id },
          data: {
            hours: existingLog.hours + additionalHours,
          },
        });
        return updatedLog;
      } else {
        const newLog = await this.prisma.workLog.create({
          data: {
            date,
            hours: additionalHours,
            userId,
          },
        });
        return newLog;
      }
    } catch (error) {
      console.error("Erroo ao atualizar registro:", error);
      throw error;
    }
  }

  public async startSession(userId: number): Promise<ActiveSession> {
    const now = new Date();
    return await this.prisma.activeSession.create({
      data: {
        userId,
        startTime: now,
      },
    });
  }

  public async endSession(
    userId: number,
    currentTime: number,
  ): Promise<number> {
    const now = new Date();
    const activeSession = await this.prisma.activeSession.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    if (activeSession) {
      const startTime = new Date(activeSession.startTime);
      const hoursWorked = (now.getTime() - startTime.getTime()) / 3600;
      await this.prisma.activeSession.update({
        where: {
          id: activeSession.id,
        },
        data: {
          endTime: now,
        },
      });
      await this.updateWorkLog(userId, now, currentTime);
      return hoursWorked;
    }

    throw new Error("Não foi encontrada sessão ativa");
  }

  public async getActiveSession(userId: number): Promise<ActiveSession | null> {
    const activeSession = await this.prisma.activeSession.findFirst({
      where: {
        userId,
        endTime: null,
      },
    });

    return activeSession;
  }
}
