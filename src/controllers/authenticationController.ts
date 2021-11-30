import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import { IUser, User } from '../model/user';
import CreateUserDto from './dto/user.dto';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import validationMiddleware from '../middleware/validationMiddleware';

class AuthenticationController {
  public path = '/auth';
  public router = Router();
  private user = User;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      response.send(user);
    }
  };
}

export default AuthenticationController;
