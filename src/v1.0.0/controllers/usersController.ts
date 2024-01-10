import { translate } from '../../v1/helpers/multilingual';
import { handleError } from '../../v1/helpers/errorHandling';
import { addDetails } from '../../v1/services/usersService';
const {
  response: {
    statuses: { success: successStatus, error: errorStatus },
    create: createResponse,
  },
} = require('../../v1/helpers/common');
const { validate } = require('../../v1/helpers/validator');

const UsersController = {
  get: async (req: any, res: any) => {
    try {
      const validations = {
        // authorization: 'required',
      };
      // Call Translate
      const translateObj = translate(req.headers.lang);
      const { data: validationData, status: validationStatus } = await validate(
        req.headers,
        validations
      );
      if (!validationStatus) {
        throw new (handleError as any)(
          translateObj.__('HEADERS_MISSING'),
          400,
          validationData
        );
      }

      const users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 30,
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          age: 28,
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          age: 35,
        },
      ];

      await addDetails();

      const status = 200;

      if (status === 200) {
        return createResponse(
          res,
          successStatus,
          users,
          translateObj.__('DATA_FETCHED')
        );
      } else {
        return createResponse(
          res,
          successStatus,
          {},
          translateObj.__('DATA_NOT_FOUND')
        );
      }
    } catch (e: any) {
      // console.error(e);
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
