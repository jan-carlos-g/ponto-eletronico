import request from "supertest";
import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";

import {
  createWorkLog,
  getWorkLogsByUser,
  startWorkLogSession,
  endWorkLogSession,
  getActiveWorkLogSession,
} from "./../src/controllers/workLogController";
import { authenticate } from "./../src/controllers/authController";
import { create } from "./../src/controllers/userController";
import { IAuthService } from "./../src/interfaces/authServiceInterface";
import { IUserService } from "./../src/interfaces/userServiceInterface";
import { IWorkLogService } from "./../src/interfaces/workLogServiceInterface";

const app = express();
app.use(express.json());

app.post("/worklog", createWorkLog);
app.post("/authenticate", authenticate);
app.post("/create", create);
app.get("/worklogs/:userId", getWorkLogsByUser);
app.post("/start-session", startWorkLogSession);
app.post("/end-session", endWorkLogSession);
app.get("/active-session/:userId", getActiveWorkLogSession);

const mockWorkLogService: Partial<IWorkLogService> = {
  updateWorkLog: jest.fn(),
  startSession: jest.fn(),
  endSession: jest.fn(),
  getWorkLogsByUser: jest.fn(),
  getActiveSession: jest.fn(),
};

const mockAuthService: Partial<IAuthService> = {
  authenticateUser: jest.fn(),
};

const mockUserService: Partial<IUserService> = {
  createUser: jest.fn(),
};

beforeEach(() => {
  container.register("WorkLogService", { useValue: mockWorkLogService });
  container.register("AuthService", { useValue: mockAuthService });
  container.register("UserService", { useValue: mockUserService });
});

describe("Controllers", () => {
  it("should create a work log", async () => {
    const mockUpdateWorkLog = jest.fn().mockResolvedValue({ id: 1 });
    (mockWorkLogService.updateWorkLog as jest.Mock) = mockUpdateWorkLog;

    const response = await request(app)
      .post("/worklog")
      .send({ userId: 1, date: "2024-07-01T00:00:00.000Z", hours: 25200 });

    expect(response.status).toBe(200);
    expect(mockUpdateWorkLog).toHaveBeenCalledWith(
      1,
      new Date("2024-07-01T00:00:00.000Z"),
      25200,
    );
  });

  it("should authenticate a user", async () => {
    const mockAuthenticateUser = jest.fn().mockResolvedValue("fake-token");
    (mockAuthService.authenticateUser as jest.Mock) = mockAuthenticateUser;

    const response = await request(app)
      .post("/authenticate")
      .send({ cod: "cod1" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("fake-token");
  });

  it("should create a user", async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({ id: 1, name: "João" });
    (mockUserService.createUser as jest.Mock) = mockCreateUser;

    const response = await request(app)
      .post("/create")
      .send({ name: "João", cod: "cod1" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("João");
  });

  it("should get work logs by user", async () => {
    const mockGetWorkLogsByUser = jest
      .fn()
      .mockResolvedValue([{ id: 1, date: new Date(), hours: 25200 }]);
    (mockWorkLogService.getWorkLogsByUser as jest.Mock) = mockGetWorkLogsByUser;

    const response = await request(app).get("/worklogs/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("should start a work log session", async () => {
    const mockStartSession = jest.fn().mockResolvedValue({ id: 1 });
    (mockWorkLogService.startSession as jest.Mock) = mockStartSession;

    const response = await request(app)
      .post("/start-session")
      .send({ userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it("should end a work log session", async () => {
    const mockEndSession = jest.fn().mockResolvedValue(3600);
    (mockWorkLogService.endSession as jest.Mock) = mockEndSession;

    const response = await request(app)
      .post("/end-session")
      .send({ userId: 1, currentTime: new Date() });

    expect(response.status).toBe(200);
    expect(response.body.hoursWorked).toBe(3600);
  });

  it("should get the active work log session", async () => {
    const mockGetActiveSession = jest.fn().mockResolvedValue({ id: 1 });
    (mockWorkLogService.getActiveSession as jest.Mock) = mockGetActiveSession;

    const response = await request(app).get("/active-session/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });
});
