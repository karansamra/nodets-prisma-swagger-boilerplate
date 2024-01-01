const squareReqAndRes: any = {
  components: {
    schemas: {
      getUsersResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'success | error',
          },
          data: {
            type: 'object',
            properties: {
              users: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    address: {
                      type: 'object',
                      properties: {
                        address_line_1: { type: 'string' },
                        locality: { type: 'string' },
                        administrative_district_level_1: { type: 'string' },
                        postal_code: { type: 'string' },
                        country: { type: 'string' },
                      },
                    },
                  },
                  required: ['id', 'name', 'address'],
                },
              },
            },
          },
          message: { type: 'string' },
        },
        required: ['status', 'data'],
      },
    },
  },
};

export default squareReqAndRes;
