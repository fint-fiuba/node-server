import HttpException from './HttpException';

class NoNextMatchException extends HttpException {
    constructor() {
        super(401, `Wrong credentials`);
    }
}

export default NoNextMatchException;