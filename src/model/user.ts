import mongoose from 'mongoose';

interface IUser {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  petCategory: string;
  petName: string;
  petSex: string;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  petCategory: string;
  petName: string;
  petSex: string;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  petCategory: {
    type: String,
    required: true,
    enum: ['DOG', 'CAT'],
  },
  petName: {
    type: String,
    required: true,
  },
  petSex: {
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE'],
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema);

export { User, IUser };
