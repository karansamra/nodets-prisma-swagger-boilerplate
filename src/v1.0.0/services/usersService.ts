import { create } from '../../v1/repository/usersRepository';

export const addDetails = async () => {
  const usersDetails = await create();
};
