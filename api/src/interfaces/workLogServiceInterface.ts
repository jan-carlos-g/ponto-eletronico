import { WorkLog, ActiveSession } from "@prisma/client";

import { WorkLogCreateInput } from "./../types/workLogInterface";

export interface IWorkLogService {
  createWorkLog(data: WorkLogCreateInput): Promise<WorkLog>;
  getWorkLogsByUser(userId: number): Promise<WorkLog[]>;
  updateWorkLog(
    userId: number,
    date: Date,
    additionalHours: number,
  ): Promise<WorkLog>;
  startSession(userId: number): Promise<ActiveSession>;
  endSession(userId: number, currentTime: number): Promise<number>;
  getActiveSession(userId: number): Promise<ActiveSession | null>;
}
