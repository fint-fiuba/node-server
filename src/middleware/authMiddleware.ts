import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../controllers/interfaces/dataStoredInToken';
import RequestWithUser from '../controllers/interfaces/requestWithUser';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import { User } from '../model/user';

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET
      ? process.env.JWT_SECRET
      : 'FINTJWTSECRET';
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const mail = verificationResponse.mail;
      const user = await User.findOne({}).where('mail').equals(mail);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;
