import { Express } from "express";

import userRoutes from "./userRoutes";
import workLogRoutes from "./workLogRoutes";

const routes = (app: Express) => {
  userRoutes(app);
  workLogRoutes(app);
};

export default routes;
