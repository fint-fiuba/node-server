import App from './app';
import AuthenticationController from './controllers/authenticationController';
import UsersController from './controllers/userController';

const app = new App(
  [new AuthenticationController(), new UsersController()],
  3000
);

app.listen();
