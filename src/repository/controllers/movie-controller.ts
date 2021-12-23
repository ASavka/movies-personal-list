import { Request, Response } from 'express';
import { MovieInput, MovieOutput } from '../models/movie';
import * as movieService from '../services/movie-service';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const OMDB_BASE_URL = 'http://www.omdbapi.com?apikey=16d8c738&t=';
const toMovieInput = (movieOMDB: any) => {
  let movie = {
    title: movieOMDB.Title,
    year: movieOMDB.Year,
    rated: movieOMDB.Rated,
    released: movieOMDB.Released,
    runtime: movieOMDB.Runtime,
    genre: movieOMDB.Genre,
    director: movieOMDB.Director,
    writer: movieOMDB.Writer,
    actors: movieOMDB.Actors,
    plot: movieOMDB.Plot,
    language: movieOMDB.Language,
    country: movieOMDB.Country,
    awards: movieOMDB.Awards,
    poster: movieOMDB.Poster,
    ratings: movieOMDB.Ratings,
    metascore: movieOMDB.Metascore,
    imdbRating: movieOMDB.imdbRating,
    imdbVotes: movieOMDB.imdbVotes,
    imdbID: movieOMDB.imdbID,
    type: movieOMDB.Type,
    dvd: movieOMDB.DVD,
    boxOffice: movieOMDB.BoxOffice,
    production: movieOMDB.Production,
    website: movieOMDB.Website,
    response: movieOMDB.Response,
  };
  return movie;
};

class MoviesController {
  async create(req: Request, res: Response) {
    const movie: MovieInput = req.body;
    let newMovie: MovieInput;
    if (movie) {
      newMovie = {
        id: uuid(),
        title: movie.title,
        comment: movie.comment,
        personalScore: movie.personalScore,
      };
    }
    axios.get(`${OMDB_BASE_URL}${movie.title}`).then(async (response) => {
      if (response.data.Error !== 'Movie not found!') {
        newMovie = Object.assign(newMovie, toMovieInput(response.data));
      }
      movieService
        .create(newMovie)
        .then((value) => {
          console.log(value);
          res.status(201).json(newMovie);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'failed to create movie' });
        });
    });
  }

  async getById(req: Request, res: Response) {
    movieService
      .getById(req.params.id)
      .then((movie) => res.status(200).json(movie))
      .catch((err) => {
        res.status(404).json({ error: err.message });
      });
  }

  async patchById(req: Request, res: Response) {
    let newData: MovieInput = req.body;
    const id = req.params.id;
    const movie = await movieService.getById(id);
    if (!movie) {
      res.status(404).json({ error: `Invalid movie ID ${id}` });
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
    movieService
      .patchById(id, newData)
      .then((value) => res.status(201).json({ message: `Movie ${id} updated` }))
      .catch((err) => res.status(500).json({ error: err.message }));
  }

  async getAll(req: Request, res: Response) {
    const movies: MovieOutput[] = await movieService.getAll();
    if (req.user) {
      const favMovies = req.user.favMovies;
      res.status(201).json({ movies, favMovies });
    } else {
      res.status(201).json({ movies });
    }
  }

  async deleteById(req: Request, res: Response) {
    const id = req.params.id;
    const numberOfDeleted = await movieService.deleteById(id);
    if (numberOfDeleted > 0) {
      res.status(200).json({ message: `Deleted movie with id ${id}` });
    } else {
      res.status(404).json({ error: 'Invalid movie ID.' });
    }
  }
}

export default new MoviesController();
