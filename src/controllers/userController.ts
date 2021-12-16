import { NextFunction, Request, Response, Router } from "express";
import { IUser, User } from "../model/user";
import NextMatch from "./dto/nextmatch.dto";
import validationMiddleware from "../middleware/validationMiddleware";
import BadCredentialException from "../exceptions/BadCredentialsException";
import NoNextMatchException from "../exceptions/NoNextMatchException";
import Reject from "./dto/reject.dto";
import Match from "./dto/match.dto";
import GetUser from "./dto/get_user.dto";
import UpdateUser from "./dto/update.dto";
import MutualMatches from "./dto/mutualmatches.dto";
import authMiddleware from "../middleware/authMiddleware";

class UsersController {
  public path = "/user";
  public router = Router();
  private user = User;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getUser);

    this.router.get(`${this.path}/nextmatch`, this.nextMatch);
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
    this.router.get(
      `${this.path}/mutualmatches`,
      this.mutualMatches
    );
    this.router.post(
      `${this.path}/update`,
      validationMiddleware(UpdateUser),
      this.update
    );
  }

  private getUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userMail = request.query.mail;
    if (!userMail || !(typeof userMail === "string")) {
      next(new NoNextMatchException());
      return;
    }
    const user = await User.findOne({ mail: userMail }).exec();
    if (user) {
      response.status(200).send(user);
    } else {
      next(new BadCredentialException());
    }
  };

  private update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: UpdateUser = request.body;
    const user = await User.findOne({ mail: userData.mail });

    if (user) {

      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.petCategory = userData.petCategory;
      user.petName = userData.petName;
      user.petSex = userData.petSex;
      user.image = userData.image;
      user.petAge = userData.petAge;

      user.save();

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
    const nextM = request.query.mail;
    if (!nextM || !(typeof nextM === "string")) {
      next(new NoNextMatchException());
      return;
    }

    const user = await this.user.findOne({ mail: nextM }).exec();

    if (user) {
      const otherUser = await this.user
      .findOne({
          $and: [{
              mail: {
                  $ne: user.mail
              }
          }, {
              mail: {
                  $nin: user.prevMatches
              }
          }, {
              mail: {
                  $nin: user.prevRejects
              }
          }, {
              petSex: {
                  $ne: user.petSex
              }
          }, {
              petCategory: {
                  $eq: user.petCategory
              }
          }]
      })
      .exec();

      response.status(200).send(otherUser);

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
    const userMail = request.query.mail;
    if (!userMail || !(typeof userMail === "string")) {
      next(new NoNextMatchException());
      return;
    }
    const user = await this.user
      .findOne({ mail: userMail })
      .exec();
    if (user) {
      const mutualMatches = await this.user
        .findOne({ mail: userMail }, { _id: -1 })
        .select("mutualMatches")
        .exec();

      if (mutualMatches) {
        const userMatches = await this.user.find({}).where("mail").in(mutualMatches.mutualMatches).exec();
        response.status(200).send(userMatches);
      } else {
        response.status(200).send();
      }
    } else {
      next(new BadCredentialException());
    }
  };
}

export default UsersController;
