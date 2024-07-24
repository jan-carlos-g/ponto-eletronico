import { UserCreateInput } from "../types/userInterface";

export interface IUserService {
  createUser(data: UserCreateInput): Promise<any>;
}
