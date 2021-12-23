import { Router } from 'express';
import userController from '../controllers/user-controller';
import { authOnly } from '../middleware';

const userRouter = Router();

userRouter.get('/users/:name', authOnly, userController.getUserByName);

userRouter.patch('/favmovies', authOnly, userController.patch);

userRouter.post('/auth/registration', userController.createUser);

userRouter.post('/auth/login', userController.login);

export default userRouter;
