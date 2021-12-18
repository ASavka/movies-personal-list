import { User } from '../models';
import { UserInput, UserOutput, UserPatchInput } from '../models/user';

export const create = (payload: UserInput): Promise<UserOutput> => {
  return User.create(payload);
};

export const getByName = async (name: string): Promise<UserOutput> => {
  const user = await User.findOne({ where: { name: name } });
  if (!user) {
    throw Error('Not found');
  }
  return user;
};

export const patchByName = async (
  name: string,
  payload: UserPatchInput
): Promise<number> => {
  const updated = await User.update(payload, { where: { name } });

  return updated[0];
};
