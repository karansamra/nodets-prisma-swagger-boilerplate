import { IReturnType } from 'v1/types/common';
import * as userRepository from '../repository/usersRepository';
import { IUser } from 'v1/types/users';

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
    return {
      success: false,
      data: { resData: {}, resType: GetUserReturnValues.SomethingWrong },
      error,
    };
  }
};
