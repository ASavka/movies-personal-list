import express, { Request, Response, Application, NextFunction } from 'express';
import { config } from './config';
import logger from './logger';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import * as _ from 'underscore';
import { encrypt, decrypt } from './crypt';
import argon2 from 'argon2';

const db = [
  {
    name: 'Anton',
    pass: '$argon2i$v=19$m=16,t=2,p=1$UjRvb2RaekdERVFxU3pqRA$8a9b8uwCaTtk3cqYdMtwsQ',
    role: 'admin',
    favMovies: ['avatar'],
  },
];
const OMDB_BASE_URL = 'http://www.omdbapi.com?apikey=16d8c738&t=';
const app: Application = express();
const PORT = config.APP_PORT;
const ENV = config.ENV;
let movies: any[] = [];

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const {
    route: { path },
    method,
    body,
    query,
    headers,
  } = req;

  logger.info(`${method} ${path} ${headers['x-request-id'] || uuid()}`);

  next();
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  res.status(500).send(err.message);

  next();
};

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

app.use(express.json({ limit: '50mb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const tokenData = decrypt(token);
    const user = db.find((user) => user.name === tokenData.payload.name);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    logger.error(err);
  } finally {
    next();
  }
});

interface Movie {
  name: string;
  comment?: string;
  personalScore?: number;
}

app.post('/movies', requestLogger, (req: Request, res: Response): void => {
  const movie: Movie = req.body;
  axios.get(`${OMDB_BASE_URL}${movie.name}`).then((response) => {
    let newMovie;

    if (response.data.Error === 'Movie not found!') {
      newMovie = {
        Title: movie.name,
        comment: movie.comment,
        personalScore: movie.personalScore,
      };
    } else {
      newMovie = response.data;
      newMovie.comment = movie.comment;
      newMovie.personalScore = movie.personalScore;
    }
    newMovie.id = uuid();
    movies.push(newMovie);
    res.send(newMovie);
  });
});

app.get('/movies', requestLogger, (req: Request, res: Response) => {
  const sortProperty = req.query.sortBy;
  const perPage = (req.query as any).perPage;
  const pageNumber = (req.query as any).pageNumber;
  let sortedMovies = movies;
  if (sortProperty) {
    sortedMovies = _.sortBy(sortedMovies, sortProperty);
  }
  if (perPage && pageNumber) {
    sortedMovies = _.chunk(sortedMovies, parseInt(perPage));
    sortedMovies = sortedMovies[parseInt(pageNumber)];
  }
  if (req.user) {
    res.json({
      favMovies: req.user.favMovies,
      movies: sortedMovies,
    });
  } else {
    res.json({ movies: sortedMovies });
  }
});

app.get(`/movies/:id`, requestLogger, (req: Request, res: Response) => {
  const id = req.params.id;
  const movie = movies.find((m) => m.id === id);
  if (movie) {
    res.send(movie);
  } else {
    res.statusCode = 404;
    res.send('Invalid movie ID');
  }
});

app.patch(
  '/movies/:id',
  requestLogger,
  (req: Request, res: Response, next: NextFunction) => {
    let newData: Omit<Movie, 'name'> = req.body;
    const id = req.params.id;
    let movie = movies.find((m) => m.id === id);
    if (!movie) {
      res.statusCode = 404;
      res.send('Invalid movie ID');
      return;
    }

    if (newData.comment && movie.comment !== newData.comment) {
      movie.comment = newData.comment;
    }
    if (
      newData.personalScore &&
      movie.personalScore !== newData.personalScore
    ) {
      movie.personalScore = newData.personalScore;
    }
    res.send(movie);
  }
);

app.delete('/movies/:id', requestLogger, (req: Request, res: Response) => {
  const id = req.params.id;
  if (movies.find((m) => m.id === id)) {
    movies = movies.filter((m) => m.id !== id);

    res.send(`movie with id ${id} deleted`);
  } else {
    res.status(404).json({ error: 'Invalid movie ID.' });
  }
});

app.use(errorHandler);

const authRouter = express.Router();

authRouter.post('/registration', async (req: Request, res: Response) => {
  req.body.pass = await argon2.hash(req.body.pass);
  const { name, pass, role } = req.body;

  const user = db.find((user) => user.name === name);
  if (user) {
    res.status(409).json({ error: `User with name ${name} exists` });
  } else {
    db.push({
      name: name,
      pass: pass,
      role: role || 'user',
      favMovies: [],
    });

    res.status(201).json({ message: `User ${name} registered` });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { name, pass } = req.body;
  const user = db.find((user) => user.name === name);
  if (!user || !(await argon2.verify(user.pass, pass))) {
    res.status(404).json({ error: 'User or password not found' }).end();
  } else {
    const token = encrypt({ name: user.name, role: user.role });
    res.status(201).json({ token: token }).end();
  }
});

const authOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  next();
};

app.get('/users/:name', authOnly, (req: Request, res: Response) => {
  if (req.params.name === req.user.name || req.user.role === 'admin') {
    const user = db.find((user) => user.name === req.params.name);
    if (user) {
      res.status(201).json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

app.patch('/users/:name', authOnly, (req: Request, res: Response) => {
  const myMovies = req.body.favMovies;
  if (req.params.name === req.user.name) {
    const i = db.findIndex((user) => user.name === req.params.name);
    db[i].favMovies = myMovies;
    res.status(201).json(db[i]);
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

app.use('/auth', authRouter);

app.listen(PORT, (): void => {
  logger.info(
    `Server is running here 👉 http://localhost:${PORT}. Env is ${ENV}`
  );
});
