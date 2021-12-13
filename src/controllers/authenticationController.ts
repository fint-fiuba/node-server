import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser, User } from '../model/user';
import CreateUserDto from './dto/user.dto';
import RepeatedEmailException from '../exceptions/RepeatedEmailException';
import validationMiddleware from '../middleware/validationMiddleware';
import LogInDto from './dto/login.dto';
import BadCredentialException from '../exceptions/BadCredentialsException';
import TokenData from './interfaces/tokenData.interface';
import DataStoredInToken from './interfaces/dataStoredInToken';
import authMiddleware from '../middleware/authMiddleware';

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
        prevMatches: [userData.mail],
        prevRejects: [userData.mail],
        mutualMatches: [],
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
        const tokenData = this.createToken(user);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.status(200).send(loggedUser);
      } else {
        next(new BadCredentialException());
      }
    } else {
      next(new BadCredentialException());
    }
  };

  private createToken(loggedUser: IUser): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET
      ? process.env.JWT_SECRET
      : 'FINTJWTSECRET';
    const dataStoredInToken: DataStoredInToken = {
      mail: loggedUser.mail,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationController;
