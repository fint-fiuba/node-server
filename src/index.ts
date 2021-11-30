import mongoose from 'mongoose';
import App from './app';
import UsersController from './controllers/userController';

mongoose.connect(
  'mongodb://localhost:27017/animaltinder',
  {
    autoCreate: true,
  },
  () => {
    console.log('connected to database');
  }
);

const app = new App([new UsersController()], 3000);

app.listen();
