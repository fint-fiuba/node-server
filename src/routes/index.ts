import express from 'express';
import { UserRouter } from './user';
const router = express.Router();

router.use('/user', UserRouter);

export default router;
