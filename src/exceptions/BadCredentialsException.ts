import HttpException from './HttpException';

class BadCredentialException extends HttpException {
  constructor() {
    super(401, `Wrong credentials`);
  }
}

export default BadCredentialException;
