import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { container } from "tsyringe";

import { IUserService } from "../interfaces/userServiceInterface";

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const hashCod = await bcrypt.hash(data.cod, 10);
    data.cod = hashCod;
    const userService = container.resolve<IUserService>("UserService");
    const user = await userService.createUser(data);
    res.status(200).send(user);
  } catch (error: any) {
    res.status(400).send({ message: error.message || "An error occurred" });
  }
};
