import { Router } from 'express';
import moment from 'moment';
const routes = Router();
import UsersController from './controllers/usersController';
import validateResource from './middlewares/validators/validator';
import {
  listUsersSchema,
  signupSchema,
  uuidSchema,
} from './middlewares/validators/schema/authValidation';

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
// Authentication
routes.get('/v1/users', UsersController.get);

routes.post(
  '/v1/signup',
  validateResource(signupSchema),
  UsersController.addUser
);

routes.get(
  '/v1/user/:userId',
  validateResource(uuidSchema),
  UsersController.getOne
);

// FIXME: The endpoint '/v1/users' is already occupied for listing users.
// For Zod implementation purposes, I am using '/v1/list-users' instead.
// Update this endpoint in the future to align with your requirements.

routes.get(
  '/v1/list-users',
  validateResource(listUsersSchema),
  UsersController.getUsers
);

export default routes;
