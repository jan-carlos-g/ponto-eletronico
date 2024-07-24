import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JwtPayload } from "../types/auth.d";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_secret_key",
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user as JwtPayload;
      next();
    },
  );
};
