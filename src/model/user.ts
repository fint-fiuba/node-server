import mongoose from 'mongoose';

type Species = "DOG" | "CAT";
type Sex = "MALE" | "FEMALE";

interface IUser {
  firstName: String;
  lastName: String;
  mail: String;
  password: String;
  petCategory: Species;
  petName: String;
  petSex: Sex;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  firstName: String;
  lastName: String;
  mail: String;
  password: String;
  petCategory: String;
  petName: String;
  petSex: String;
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

export { User };
