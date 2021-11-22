import express, { Request, Response, Application, NextFunction } from 'express';
import { config } from './config';
import logger from './logger';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import * as _ from 'underscore';

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

app.use(express.json({ limit: '50mb' }));

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
  let perPage = (req.query as any).perPage;
  let pageNumber = (req.query as any).pageNumber;
  let sortedMovies = movies;
  if (sortProperty) {
    sortedMovies = _.sortBy(sortedMovies, sortProperty);
  }
  if (perPage && pageNumber) {
    sortedMovies = _.chunk(sortedMovies, parseInt(perPage));
    sortedMovies = sortedMovies[parseInt(pageNumber)];
  }

  res.send(sortedMovies);
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
  `/movies/:id`,
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

app.delete(`/movies/:id`, requestLogger, (req: Request, res: Response) => {
  const id = req.params.id;
  if (movies.find((m) => m.id === id)) {
    movies = movies.filter((m) => m.id !== id);

    res.send(`movie with id ${id} deleted`);
  } else {
    res.statusCode = 404;
    res.send('Invalid movie ID.');
  }
});

app.use(errorHandler);

app.listen(PORT, (): void => {
  logger.info(
    `Server is running here 👉 http://localhost:${PORT}. Env is ${ENV}`
  );
});
