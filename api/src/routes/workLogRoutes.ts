import { Express } from "express";

import {
  createWorkLog,
  getWorkLogsByUser,
  startWorkLogSession,
  endWorkLogSession,
  getActiveWorkLogSession,
} from "../controllers/workLogController";
import { authenticateToken } from "../middleware/auth.middleware";

const workLogRoutes = (app: Express) => {
  app.post("/worklogs", authenticateToken, createWorkLog);
  app.get("/worklogs/:userId", authenticateToken, getWorkLogsByUser);
  app.post("/worklogs/start", authenticateToken, startWorkLogSession);
  app.post("/worklogs/end", authenticateToken, endWorkLogSession);
  app.get(
    "/worklogs/active/:userId",
    authenticateToken,
    getActiveWorkLogSession,
  );
};

export default workLogRoutes;
