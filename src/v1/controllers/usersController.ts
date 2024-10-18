import { plainToClass } from 'class-transformer';
import { UserDTO } from '../dto/userDto';
import * as commonMethod from '../helpers/common';
import { translate } from '../helpers/multilingual';
import {
  getUser,
  listUsers,
  registerUser,
  RegisterUserReturnValues,
} from '../services/usersService';
import { Request, Response } from 'express';
const {
  response: {
    statuses: { success: successStatus, error: errorStatus },
    create: createResponse,
  },
  responseStatusCodes: { badRequest, ok },
} = commonMethod;

const UsersController = {
  get: async (req: any, res: any) => {
    try {
      const translateObj = translate(req.headers.lang);
      const userData = plainToClass(UserDTO, req.body, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      const userDetails = await registerUser(userData);

      if (userDetails.success) {
        return createResponse(
          res,
          successStatus,
          userDetails.data.resData,
          translateObj.__('DATA_FETCHED')
        );
      } else {
        let message = translateObj.__('DATA_NOT_FOUND'); // define messages according to service response
        if (
          userDetails.data.resType === RegisterUserReturnValues.UserNotCreated
        ) {
          message = translateObj.__('DATA_NOT_FOUND');
        }
        return createResponse(res, errorStatus, {}, message);
      }
    } catch (e: any) {
      console.error(e);
      return createResponse(
        res,
        errorStatus,
        {},
        e.message,
        e.code,
        e.errorData
      );
    }
  },

  addUser: async (req: Request, res: Response) => {
    try {
      const translateObj = translate(req.headers.lang);

      const userData = plainToClass(UserDTO, req.body, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      const userDetails = await registerUser(userData);

      if (
        userDetails.success &&
        userDetails.data.resType === RegisterUserReturnValues.UserCreated
      ) {
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

      return createResponse(res, errorStatus, {}, responseMessage, badRequest);
    } catch (error: any) {
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

  getOne: async (req: Request, res: Response) => {
    try {
      const translateObj = translate(req.headers.lang);

      const { userId } = req.params;

      const { success, data } = await getUser(userId);

      let responseMessage = success
        ? translateObj.__('USER_FETCHED')
        : translateObj.__('USER_NOT_AVAILABLE');

      return createResponse(
        res,
        success ? successStatus : errorStatus,
        data,
        responseMessage,
        success ? ok : badRequest
      );
    } catch (error: any) {
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
      console.log('req.query: ', req.query);

      const { success, data } = await listUsers(
        Number(page),
        Number(limit),
        search as string
      );

      let responseMessage = success
        ? translateObj.__('USERS_FETCHED')
        : translateObj.__('USERS_NOT_AVAILABLE');

      return createResponse(
        res,
        success ? successStatus : errorStatus,
        data,
        responseMessage,
        success ? ok : badRequest
      );
    } catch (error: any) {
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

  add: async (req: any, res: any) => {},
  update: async (req: any, res: any) => {},
  delete: async (req: any, res: any) => {},
  patch: async (req: any, res: any) => {},
};

export default UsersController;
