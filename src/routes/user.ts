import express, { Request, Response } from 'express';
const { v4: uuidv4 } = require('uuid');

import { User } from '../model/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const user = await User.find({});
  return res.status(200).send(user);
});

router.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, mail, password, petCategory, petName, petSex } =
    req.body;

  const id = uuidv4();
  //Para no inicializarlas vacias
  const prevMatches: [String] = [id];
  const prevRejects: [String] = [id];

  try {
    const user = User.build({
      id,
      firstName,
      lastName,
      mail,
      password,
      petCategory,
      petName,
      petSex,
      prevMatches,
      prevRejects,
    });
    await user.save();
    return res.status(201).send();
  } catch (err) {
    console.error('logging', err);
    return res.status(500).send();
  }
});

// pongo /nextmatch como algo temporal
router.post('/nextmatch', async (req: Request, res: Response) => {
  const { _id } =
    req.body;

  const user = await User.findOne({ id: _id });

  if (user === null) return;

  const otroUser = await User.findOne({
    id: { $ne: user.id, $nin: user.prevMatches.concat(user.prevRejects) },
    petCategory: { $eq: user.petCategory },
    petSex: { $ne: user.petSex },
  })

  return res.status(200).send(otroUser);
});

router.post('/reject', async (req: Request, res: Response) => {
  const { _id, otro_id } =
    req.body;

  User.updateOne(
    { id: _id },
    { $addToSet: { prevRejects: otro_id } }
  );

  return res.status(200).send();
});

router.post('/match', async (req: Request, res: Response) => {
  const { _id, otro_id } =
    req.body;

  User.updateOne(
    { id: _id },
    { $addToSet: { prevMatches: otro_id } }
  );

  return res.status(200).send();
});

export { router as UserRouter };
