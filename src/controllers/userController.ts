import { NextFunction, Request, Response, Router } from 'express';
import { IUser, User } from '../model/user';
import NextMatch from './dto/nextmatch.dto';
import validationMiddleware from '../middleware/validationMiddleware';
import BadCredentialException from '../exceptions/BadCredentialsException';
import NoNextMatchException from '../exceptions/NoNextMatchException';
import Reject from './dto/reject.dto';
import Match from './dto/match.dto';

class UsersController {
  public path = '/user';
  public router = Router();
  private user = User;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);

    this.router.post(
      `${this.path}/nextmatch`,
      validationMiddleware(NextMatch),
      this.nextMatch
    );
    this.router.post(
      `${this.path}/reject`,
      validationMiddleware(Reject),
      this.reject
    );
    this.router.post(
      `${this.path}/match`,
      validationMiddleware(Match),
      this.match
    );
  }

  private getAllUsers = async (request: Request, response: Response) => {
    const users = await User.find({});
    response.send(users);
  };

  private nextMatch = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const logInData: NextMatch = request.body;
    const user = await this.user
      .findOne({ mail: logInData.mail })
      .exec();
    if (user) {
      const otherUser = await this.user
        .findOne({})
        .where('mail').ne(user.mail)
        .where('mail').nin(user.prevMatches)
        .where('mail').nin(user.prevRejects)
        .where('petSex').ne(user.petSex)
        .where('petCategory').equals(user.petCategory)
        .exec();

      if (otherUser) {
        response.status(200).send(otherUser);
      } else {
        next(new NoNextMatchException());
      }
    } else {
      next(new BadCredentialException());
    }
  };

  private reject = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const logInData: Reject = request.body;
    const user = await this.user
      .findOne({ mail: logInData.mail })
      .exec();
    if (user) {
      await this.user.updateOne({ mail: logInData.mail },
        { $push: { prevRejects: logInData.otherMail } });
    } else {
      next(new BadCredentialException());
    }
  };

  private match = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const logInData: Match = request.body;
    const user = await this.user
      .findOne({ mail: logInData.mail })
      .exec();
    if (user) {

      const otherUser = await this.user
        .findOne({ mail: logInData.otherMail })
        .exec();

      if (otherUser) {
        await this.user.updateOne({ mail: logInData.mail },
          { $push: { prevMatches: logInData.otherMail } });

        if (user.mail in otherUser.prevMatches) {
          await this.user.updateOne({ mail: user.mail },
            { $push: { mutualMatches: otherUser.mail } });

          await this.user.updateOne({ mail: otherUser.mail },
            { $push: { mutualMatches: user.mail } });

          response.status(200).send();
        }
      } else {
        next(new BadCredentialException());
      }
    } else {
      next(new BadCredentialException());
    }
  };
}

export default UsersController;
