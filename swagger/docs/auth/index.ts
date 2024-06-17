import authComponents from './components';
const {
  components: {
    schemas: { addUserRequest, userLogin, getAuthResponse },
  },
} = authComponents;

const auth: any = {
  '/sign-up': {
    post: {
      tags: ['Auth'],
      summary: 'Register User api to create a new user',
      description: 'This API allows add a new user.',
      operationId: 'addUser',
      requestBody: {
        required: ['email', 'password'],
        description: 'User details to add',
        content: {
          'application/json': {
            schema: addUserRequest,
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: getAuthResponse,
            },
          },
        },
        500: {
          content: {
            'application/json': {
              schema: getAuthResponse,
            },
          },
        },
        400: {
          content: {
            'application/json': {
              schema: getAuthResponse,
            },
          },
        },
      },
    },
  },
  '/login': {
    post: {
      tags: ['Auth'],
      summery: 'Login',
      Description: 'Login',
      operationId: 'Login',
      requestBody: {
        required: ['deviceId', 'password'],
        content: {
          'application/json': {
            schema: userLogin,
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: getAuthResponse,
            },
          },
          description: 'User Login Successfully',
        },
        500: {
          content: {
            'application/json': {
              schema: getAuthResponse,
            },
          },
        },
        400: {
          content: {
            'application/json': {
              schema: getAuthResponse,
            },
          },
        },
      },
    },
  },
};

export default auth;
