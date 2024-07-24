import { WorkLog } from "@prisma/client";

export interface WorkLogCreateInput {
  date: Date;
  hours: number;
  userId: number;
}
export interface WorkPages {
  workLogs: WorkLog[];
  totalPages: number;
}
