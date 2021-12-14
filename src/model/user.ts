import mongoose from 'mongoose';

interface IUser {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  petCategory: string;
  petName: string;
  petSex: string;
  prevMatches: [string];
  prevRejects: [string];
  mutualMatches: [string];
  image: string;
  petAge: string;
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
  prevMatches: [string];
  prevRejects: [string];
  mutualMatches: [string];
  image: string;
  petAge: string;
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
  prevMatches: {
    type: [String],
    required: true,
  },
  prevRejects: {
    type: [String],
    required: true,
  },
  mutualMatches: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  petAge: {
    type: String,
    required: true,
  }
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema);

export { User, IUser };
