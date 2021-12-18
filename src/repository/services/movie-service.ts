import * as movieDal from '../dal/movie-dal';
import { MovieInput, MovieOutput } from '../models/movie';

export const create = (payload: MovieInput): Promise<MovieOutput> => {
  return movieDal.create(payload);
};

export const getById = (id: string): Promise<MovieOutput> => {
  return movieDal.getById(id);
};

export const deleteById = (id: string): Promise<number> => {
  return movieDal.deleteById(id);
};

export const getAll = (): Promise<MovieOutput[]> => {
  return movieDal.getAll();
};
export const patchById = (id: string, payload: MovieInput): Promise<number> => {
  return movieDal.patchById(id, payload);
};
