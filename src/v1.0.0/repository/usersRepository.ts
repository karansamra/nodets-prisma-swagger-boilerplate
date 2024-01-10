import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async () => {
  const user = await prisma.user.create({
    data: {
      username: 'karan007',
      email: 'karan007@yopmail.com',
      password: 'Test@123',
      verified: true,
    },
  });
  console.log('user', user);
};
