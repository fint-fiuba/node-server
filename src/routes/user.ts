import express, { Request, Response } from 'express';
import { User } from '../model/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const user = await User.find({});
  return res.status(200).send(user);
});

router.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, mail, password, petCategory, petName, petSex } =
    req.body;

  try {
    const user = User.build({
      firstName,
      lastName,
      mail,
      password,
      petCategory,
      petName,
      petSex,
    });
    await user.save();
    return res.status(201).send();
  } catch (err) {
    console.error('logging', err);
    return res.status(500).send();
  }
});

export { router as UserRouter };
