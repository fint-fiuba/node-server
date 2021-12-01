import HttpException from './HttpException';

class RepeatedEmailException extends HttpException {
  constructor(email: string) {
    super(400, `A user with email ${email} already exists`);
  }
}

export default RepeatedEmailException;
