import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();
app.use(json());
app.use(routes);

mongoose.connect(
  'mongodb://localhost:27017/animaltinder',
  {
    autoCreate: true,
  },
  () => {
    console.log('connected to database');
  }
);

app.listen(3001, () => {
  console.log('server is listening on port 3001');
});
