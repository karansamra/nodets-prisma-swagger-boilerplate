import { plainToClass } from 'class-transformer';
import { UserDTO } from '../dto/userDto';
import * as commonMethod from '../helpers/common';
import { translate } from '../helpers/multilingual';
import {
  registerUser,
  RegisterUserReturnValues,
} from '../services/usersService';
const {
  response: {
    statuses: { success: successStatus, error: errorStatus },
    create: createResponse,
  },
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
  getOne: async (req: any, res: any) => {},
  add: async (req: any, res: any) => {},
  update: async (req: any, res: any) => {},
  delete: async (req: any, res: any) => {},
  patch: async (req: any, res: any) => {},
};

export default UsersController;
