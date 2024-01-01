import squareReqAndRes from './components';

const {
  components: {
    schemas: { getUsersResponse },
  },
} = squareReqAndRes;
const squarePaths: any = {
  '/api/v1/users': {
    get: {
      tags: ['flash-cards'],
      summary: 'Get Users',
      description: 'This API provide multiple users.',
      operationId: 'getUsers',
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: getUsersResponse,
            },
          },
          500: {
            description: 'Error',
          },
          400: {
            description: 'Validation Error',
          },
        },
      },
    },
  },
};

export default squarePaths;
