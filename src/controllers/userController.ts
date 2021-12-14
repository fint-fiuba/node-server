import { NextFunction, Request, Response, Router } from 'express';
import { IUser, User } from '../model/user';
import NextMatch from './dto/nextmatch.dto';
import validationMiddleware from '../middleware/validationMiddleware';
import BadCredentialException from '../exceptions/BadCredentialsException';
import NoNextMatchException from '../exceptions/NoNextMatchException';
import Reject from './dto/reject.dto';
import Match from './dto/match.dto';
import GetUser from './dto/get_user.dto';
import UpdateUser from './dto/update.dto';
import MutualMatches from './dto/mutualmatches.dto';
import authMiddleware from '../middleware/authMiddleware';

class UsersController {
  public path = '/user';
  public router = Router();
  private user = User;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path,
      validationMiddleware(GetUser),
      this.getUser
    );

    this.router.get(
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
    this.router.post(
      `${this.path}/mutualmatches`,
      validationMiddleware(MutualMatches),
      this.mutualMatches
    );
    this.router.post(
      `${this.path}/update`,
      validationMiddleware(UpdateUser),
      this.update
    );
  }

  private getUser = async (request: Request, response: Response, next: NextFunction) => {
    const userData: GetUser = request.body;
    const user = await User.find({ mail: userData.mail }).exec();
    if (user) {
      response.status(200).send(user);
    } else {
      next(new BadCredentialException());
    }
  };

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const userData: UpdateUser = request.body;
    const user = await User.findOne({ mail: userData.mail });

    if (user) {
      if (userData.firstName) { user.firstName = userData.firstName };
      if (userData.lastName) { user.lastName = userData.lastName };
      if (userData.petCategory) { user.petCategory = userData.petCategory };
      if (userData.petName) { user.petName = userData.petName };
      if (userData.petSex) { user.petSex = userData.petSex };
      if (userData.image) { user.image = userData.image };

      response.status(200).send();
    } else {
      next(new BadCredentialException());
    }
  };

  private nextMatch = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const nextMatchData: NextMatch = request.body;
    const user = await this.user.findOne({ mail: nextMatchData.mail }).exec();
    if (user) {
      const otherUser = await this.user
        .findOne({})
        .where('mail')
        .ne(user.mail)
        .where('mail')
        .nin(user.prevMatches)
        .where('mail')
        .nin(user.prevRejects)
        .where('petSex')
        .ne(user.petSex)
        .where('petCategory')
        .equals(user.petCategory)
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
    const rejectData: Reject = request.body;
    const user = await this.user.findOne({ mail: rejectData.mail }).exec();
    if (user) {
      await this.user.updateOne(
        { mail: rejectData.mail },
        { $push: { prevRejects: rejectData.otherMail } }
      );

      response.status(200).send();
    } else {
      next(new BadCredentialException());
    }
  };

  private match = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const matchData: Match = request.body;
    const user = await this.user.findOne({ mail: matchData.mail }).exec();
    console.log(user);
    if (user) {
      const otherUser = await this.user
        .findOne({ mail: matchData.otherMail })
        .exec();

      if (otherUser) {
        await this.user.updateOne(
          { mail: matchData.mail },
          { $push: { prevMatches: matchData.otherMail } }
        );

        if (user.mail in otherUser.prevMatches) {
          await this.user.updateOne(
            { mail: user.mail },
            { $push: { mutualMatches: otherUser.mail } }
          );

          await this.user.updateOne(
            { mail: otherUser.mail },
            { $push: { mutualMatches: user.mail } }
          );
        }

        response.status(200).send();

      } else {
        next(new BadCredentialException());
      }
    } else {
      next(new BadCredentialException());
    }
  };

  private mutualMatches = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const mutualMatchesData: Reject = request.body;
    const user = await this.user
      .findOne({ mail: mutualMatchesData.mail })
      .exec();
    if (user) {
      const mutualMatches = await this.user
        .findOne({ mail: mutualMatchesData.mail }, { _id: -1 })
        .select('mutualMatches')
        .exec();

      response.status(200).send(mutualMatches);
    } else {
      next(new BadCredentialException());
    }
  };
}

export default UsersController;
