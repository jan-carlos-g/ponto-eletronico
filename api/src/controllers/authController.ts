import { Request, Response } from "express";
import { container } from "tsyringe";

import { IAuthService } from "../interfaces/authServiceInterface";

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { cod } = req.body;
    const authService = container.resolve<IAuthService>("AuthService");
    const token = await authService.authenticateUser(cod);
    res.status(200).send({ token });
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};
