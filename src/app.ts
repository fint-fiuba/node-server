import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import errorMiddleware from './middleware/errorMiddleware';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: any, port: number) {
    this.app = express();
    this.port = port;

    this.connectToDB();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);

    this.app.use(errorMiddleware);
  }

  private connectToDB() {
    mongoose.connect(
      'mongodb://localhost:27017/animaltinder',
      {
        autoCreate: true,
      },
      () => {
        console.log('connected to database');
      }
    );
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json({"limit": "10mb"}));
    this.app.use(cookieParser());

    const cors = require('cors');
    const corsOptions ={
        origin:'http://localhost:3000', 
        credentials : true,            //access-control-allow-credentials:true
        exposedHeaders: ["set-cookie"],
    }
    this.app.use(cors(corsOptions));

  }



  private initializeControllers(controllers: any[]) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
