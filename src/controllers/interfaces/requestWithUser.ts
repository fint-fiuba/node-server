import { Request } from 'express';
import { IUser } from '../../model/user';

interface RequestWithUser extends Request {
  user: IUser;
}

export default RequestWithUser;
