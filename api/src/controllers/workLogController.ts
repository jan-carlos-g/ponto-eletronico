import { Request, Response } from "express";
import { container } from "tsyringe";

import { IWorkLogService } from "../interfaces/workLogServiceInterface";

export const createWorkLog = async (req: Request, res: Response) => {
  try {
    const { userId, date, hours } = req.body;

    if (!userId || !date || hours === undefined) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const workLogService = container.resolve<IWorkLogService>("WorkLogService");

    const workLog = await workLogService.updateWorkLog(
      userId,
      dateObject,
      hours,
    );
    res.status(200).send(workLog);
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};

export const getWorkLogsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const workLogService = container.resolve<IWorkLogService>("WorkLogService");
    const workLogs = await workLogService.getWorkLogsByUser(Number(userId));
    res.status(200).send(workLogs);
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};

export const startWorkLogSession = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const workLogService = container.resolve<IWorkLogService>("WorkLogService");
    const activeSession = await workLogService.startSession(userId);
    res.status(200).send(activeSession);
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};

export const endWorkLogSession = async (req: Request, res: Response) => {
  try {
    const { userId, currentTime } = req.body;
    const workLogService = container.resolve<IWorkLogService>("WorkLogService");
    const hoursWorked = await workLogService.endSession(userId, currentTime);
    res.status(200).send({ hoursWorked });
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};

export const getActiveWorkLogSession = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const workLogService = container.resolve<IWorkLogService>("WorkLogService");
    const activeSession = await workLogService.getActiveSession(Number(userId));
    res.status(200).send(activeSession);
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};
