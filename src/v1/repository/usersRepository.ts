import { Prisma, PrismaClient } from '@prisma/client';
import { IReturnType } from '@src/v1/types/common';
const prisma = new PrismaClient();

export const createUser = async (
  createInput: Prisma.UserCreateInput
): Promise<IReturnType> => {
  try {
    const user = await prisma.user.create({
      data: createInput,
    });
    if (user) {
      return { success: true, data: { resData: user } };
    }
    return { success: false, data: { resData: {} } };
  } catch (error) {
    return { success: false, data: { resData: {} }, error };
  }
};

export const findUserById = async (userId: string): Promise<IReturnType> => {
  try {
    const savedUser = await prisma.user.findUnique({
      where: { uuid: userId },
    });

    if (savedUser) {
      return { success: true, data: { resData: savedUser } };
    } else {
      return { success: false, data: { resData: {} } };
    }
  } catch (error) {
    return { success: false, data: { resData: {} }, error };
  }
};

export const getUsers = async (
  page: number,
  limit: number,
  search?: string
): Promise<IReturnType> => {
  try {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        userName: {
          contains: search ?? '',
        },
      },
    });

    await prisma.user.count({
      where: {
        userName: {
          contains: search ?? '',
        },
      },
    });

    return {
      success: true,
      data: {
        resData: users,
      },
    };
  } catch (error) {
    return { success: false, data: { resData: [] }, error };
  }
};
