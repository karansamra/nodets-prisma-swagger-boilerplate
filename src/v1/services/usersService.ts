import { IReturnType } from '@src/v1/types/common';
import * as userModel from '@src/v1/repository/usersRepository';
import { IUser } from '@src/v1/types/users';

export const enum RegisterUserReturnValues {
  SomethingWrong = 1,
  UserNotCreated = 2,
}
export const registerUser = async (
  createUserData: IUser
): Promise<IReturnType> => {
  try {
    const usersDetails = await userModel.create(createUserData);
    if (usersDetails.success) {
      return {
        success: true,
        data: {
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
