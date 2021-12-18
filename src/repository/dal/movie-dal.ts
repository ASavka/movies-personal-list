import { Movie } from '../models';
import { MovieInput, MovieOutput } from '../models/movie';

export const create = (payload: MovieInput): Promise<MovieOutput> => {
  return Movie.create(payload);
};

export const getAll = (): Promise<MovieOutput[]> => {
  return Movie.findAll();
};

export const getById = async (id: string): Promise<MovieOutput> => {
  const movie = await Movie.findByPk(id);
  if (!movie) {
    throw Error(`Invalid movie ID ${id}`);
  }
  return movie;
};

export const deleteById = (id: string): Promise<number> => {
  return Movie.destroy({ where: { id } });
};

export const patchById = async (
  id: string,
  payload: MovieInput
): Promise<number> => {
  const updated = await Movie.update(payload, { where: { id } });

  return updated[0];
};
