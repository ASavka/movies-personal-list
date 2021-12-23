import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { decrypt } from '../crypt';
import logger from '../logger';
import * as userService from './services/user-service';
interface IUser {
  name: string;
  pass: string;
  role: string;
  favMovies: string[];
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path, method, body, query, headers } = req;

  logger.info(`${method} ${path} ${headers['x-request-id'] || uuid()}`);

  next();
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).send(err.message);

  next();
};

export const authOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  next();
};

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const tokenData = decrypt(token);
    const user = await userService.getByName(tokenData.payload.name);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    logger.error(err);
  } finally {
    next();
  }
};
