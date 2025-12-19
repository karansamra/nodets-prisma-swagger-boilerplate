import { IReturnType } from '@src/v1/types/common';
import * as userRepository from '@src/v1/repository/usersRepository';
import { IUser } from '@src/v1/types/users';
import logger from '@src/v1/utils/logging';

export const enum RegisterUserReturnValues {
  SomethingWrong = 1,
  UserNotCreated = 2,
  UserCreated = 3,
}

export const enum GetUserReturnValues {
  SomethingWrong = 1,
  UserNotFound = 2,
  UserFound = 3,
}

export const createUser = async (
  createUserData: IUser
): Promise<IReturnType> => {
  try {
    const usersDetails = await userRepository.createUser(createUserData);
    if (usersDetails.success) {
      return {
        success: true,
        data: {
          resType: RegisterUserReturnValues.UserCreated,
          resData: usersDetails.data.resData,
        },
      };
    }
    return {
      success: false,
      data: { resData: {}, resType: RegisterUserReturnValues.UserNotCreated },
    };
  } catch (error) {
    logger.error('Unhandled error in usersService.createUser', error as Error);
    return {
      success: false,
      data: { resData: {}, resType: RegisterUserReturnValues.SomethingWrong },
      error,
    };
  }
};

export const getUserById = async (userId: string): Promise<IReturnType> => {
  try {
    const userData = await userRepository.findUserById(userId);

    if (!userData.success) {
      return {
        success: false,
        data: { resData: {}, resType: GetUserReturnValues.UserNotFound },
      };
    }

    return {
      success: true,
      data: {
        resType: GetUserReturnValues.UserFound,
        resData: userData.data.resData,
      },
    };
  } catch (error: any) {
    logger.error('Unhandled error in usersService.getUserById', error as Error);
    return {
      success: false,
      data: { resData: {}, resType: GetUserReturnValues.SomethingWrong },
      error,
    };
  }
};

export const getUsers = async (
  page: number,
  limit: number,
  search?: string
): Promise<IReturnType> => {
  try {
    const userData = await userRepository.getUsers(page, limit, search);

    if (!userData.success) {
      return {
        success: false,
        data: { resData: {}, resType: GetUserReturnValues.UserNotFound },
      };
    }

    return {
      success: true,
      data: {
        resType: GetUserReturnValues.UserFound,
        resData: userData.data,
      },
    };
  } catch (error: any) {
    logger.error('Unhandled error in usersService.getUsers', error as Error, {
      page,
      limit,
      hasSearch: Boolean(search),
    });
    return {
      success: false,
      data: { resData: {}, resType: GetUserReturnValues.SomethingWrong },
      error,
    };
  }
};
