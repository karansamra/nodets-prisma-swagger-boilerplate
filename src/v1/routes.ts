import { Router } from 'express';
import moment from 'moment';
import UsersController from './controllers/usersController';
import validateResource from './middlewares/validators/validator';
import {
  listUsersSchema,
  signupSchema,
  uuidSchema,
} from './middlewares/validators/schema/authValidation';

const routes = Router();

/*---------------------------------------------------------------------------------
 Define All the Routes Below. The routes will follow REST API standards strictly.
 ---------------------------------------------------------------------------------*/
routes.get('/', (req, res) => {
  const port = process.env.PORT ?? 3001;
  res.send(
    `The Express Application is running on this Server. Server DateTime: ${moment().format(
      'MMMM Do YYYY, h:mm:ss a z'
    )} <br><br> Swagger is running on <a href="http://localhost:${port}/api-docs">http://localhost:${port}/api-docs</a>`
  );
});

routes.post(
  '/v1/signup',
  validateResource(signupSchema),
  UsersController.registerUser
);

routes.get(
  '/v1/user/:userId',
  validateResource(uuidSchema),
  UsersController.getUser
);

routes.get(
  '/v1/users',
  validateResource(listUsersSchema),
  UsersController.getUsers
);

export default routes;
