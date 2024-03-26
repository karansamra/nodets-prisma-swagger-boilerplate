import { create } from '../../v1.0.0/repository/usersRepository';

export const addDetails = async () => {
  const usersDetails = await create();
};
