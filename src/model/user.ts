import mongoose from 'mongoose';

type Species = "DOG" | "CAT";
type Sex = "MALE" | "FEMALE";

interface IUser {
  id: String;
  firstName: String;
  lastName: String;
  mail: String;
  password: String;
  petCategory: Species;
  petName: String;
  petSex: Sex;
  prevMatches: [String];
  prevRejects: [String];
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  id: String;
  firstName: String;
  lastName: String;
  mail: String;
  password: String;
  petCategory: String;
  petName: String;
  petSex: String;
  prevMatches: [String];
  prevRejects: [String];
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

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
    required: true
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema);

export { User };
