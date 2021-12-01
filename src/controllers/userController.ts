import { Router, Request, Response } from 'express';
import { IUser, User } from '../model/user';

class UsersController {
  public path = '/user';
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
  }

  private getAllUsers = async (request: Request, response: Response) => {
    const users = await User.find({});
    response.send(users);
  };
}

export default UsersController;
