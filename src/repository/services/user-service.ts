import * as userDal from '../dal/user-dal';
import { UserInput, UserOutput, UserPatchInput } from '../models/user';

export const create = (payload: UserInput): Promise<UserOutput> => {
  return userDal.create(payload);
};

export const getByName = (name: string): Promise<UserOutput> => {
  return userDal.getByName(name);
};

export const patchByName = (
  name: string,
  payload: UserPatchInput
): Promise<number> => {
  return userDal.patchByName(name, payload);
};
