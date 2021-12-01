import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import { IUser, User } from '../model/user';
import CreateUserDto from './dto/user.dto';
import RepeatedEmailException from '../exceptions/RepeatedEmailException';
import validationMiddleware from '../middleware/validationMiddleware';
import LogInDto from './dto/login.dto';
import BadCredentialException from '../exceptions/BadCredentialsException';

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
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.logIn
    );
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ mail: userData.mail })) {
      next(new RepeatedEmailException(userData.mail));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      response.status(201).send();
    }
  };

  private logIn = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user
      .findOne({ mail: logInData.mail })
      .select('+password')
      .exec();
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        const loggedUser = await this.user.findOne({ mail: logInData.mail });
        response.status(200).send(loggedUser);
      } else {
        next(new BadCredentialException());
      }
    } else {
      next(new BadCredentialException());
    }
  };
}

export default AuthenticationController;
