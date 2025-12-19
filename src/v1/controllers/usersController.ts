import { plainToClass } from 'class-transformer';
import { UserDTO } from '@src/v1/dto/userDto';
import * as commonMethod from '@src/v1/helpers/common';
import { translate } from '@src/v1/helpers/multilingual';
import { logError, logInfo, logWarn } from '@src/v1/utils/logHelper';
import {
  getUserById,
  getUsers,
  createUser,
  RegisterUserReturnValues,
} from '@src/v1/services/usersService';
import { Request, Response } from 'express';
const {
  response: {
    statuses: { success: successStatus, error: errorStatus },
    create: createResponse,
  },
  responseStatusCodes: { badRequest, ok },
} = commonMethod;

const UsersController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const translateObj = translate(req.headers.lang);
      logInfo(req, 'UsersController.registerUser called');

      const userData = plainToClass(UserDTO, req.body, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const userDetails = await createUser(userData);

      if (
        userDetails.success &&
        userDetails.data.resType === RegisterUserReturnValues.UserCreated
      ) {
        logInfo(req, 'UsersController.registerUser succeeded');
        return createResponse(
          res,
          successStatus,
          userDetails.data.resData,
          translateObj.__('USER_CREATED_SUCCESSFULLY')
        );
      }

      let responseMessage = '';
      switch (userDetails.data.resType) {
        case RegisterUserReturnValues.UserNotCreated:
          responseMessage = translateObj.__('USER_NOT_CREATED');
          break;
        case RegisterUserReturnValues.SomethingWrong:
          responseMessage = translateObj.__('SOMETHING_WENT_WRONG');
          break;
      }

      logWarn(req, 'UsersController.registerUser failed', {
        resType: userDetails?.data?.resType,
      });
      return createResponse(res, errorStatus, {}, responseMessage, badRequest);
    } catch (error: any) {
      logError(req, 'Unhandled error in UsersController.registerUser', error);
      return createResponse(
        res,
        errorStatus,
        {},
        error.message,
        error.code,
        error.errorData
      );
    }
  },

  getUser: async (req: Request, res: Response) => {
    try {
      const translateObj = translate(req.headers.lang);
      logInfo(req, 'UsersController.getUser called');

      const { userId } = req.params;

      const { success, data } = await getUserById(userId);

      let responseMessage = success
        ? translateObj.__('USER_FETCHED')
        : translateObj.__('USER_NOT_AVAILABLE');

      logInfo(
        req,
        success
          ? 'UsersController.getUser succeeded'
          : 'UsersController.getUser not found'
      );
      return createResponse(
        res,
        success ? successStatus : errorStatus,
        data,
        responseMessage,
        success ? ok : badRequest
      );
    } catch (error: any) {
      logError(req, 'Unhandled error in UsersController.getUser', error);
      return createResponse(
        res,
        errorStatus,
        {},
        error.message,
        error.code,
        error.errorData
      );
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const translateObj = translate(req.headers.lang);

      const { page, limit, search } = req.query;
      logInfo(req, 'UsersController.getUsers called', {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        hasSearch: Boolean(search),
      });

      const { success, data } = await getUsers(
        Number(page),
        Number(limit),
        search as string
      );

      let responseMessage = success
        ? translateObj.__('USERS_FETCHED')
        : translateObj.__('USERS_NOT_AVAILABLE');

      if (!success) {
        logWarn(req, 'UsersController.getUsers failed');
      }
      return createResponse(
        res,
        success ? successStatus : errorStatus,
        data,
        responseMessage,
        success ? ok : badRequest
      );
    } catch (error: any) {
      logError(req, 'Unhandled error in UsersController.getUsers', error);
      return createResponse(
        res,
        errorStatus,
        {},
        error.message,
        error.code,
        error.errorData
      );
    }
  },
};

export default UsersController;
