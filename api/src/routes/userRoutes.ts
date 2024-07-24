import { Express } from "express";

import { authenticate } from "../controllers/authController";
import { create } from "../controllers/userController";

const userRoutes = (app: Express) => {
  app.post("/users", create);
  app.post("/login", authenticate);
};

export default userRoutes;
