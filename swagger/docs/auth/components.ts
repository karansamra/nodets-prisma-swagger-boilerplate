const authComponent = {
  components: {
    schemas: {
      addUserRequest: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            require: true,
            description: 'enter user First Name',
          },
          lastName: {
            type: 'string',
            require: true,
            description: 'enter user Last Name',
          },
          email: {
            type: 'string',
            format: 'email',
            require: true,
            description: 'enter user Email',
          },
          password: {
            type: 'string',
            require: true,
            description:
              'enter password containing a uppercase ,lowercase and special character',
          },
          confirmPassword: {
            type: 'string',
            require: true,
            description: 'enter Password to re-verify',
          },
          dob: {
            type: 'string',
            default: '',
            description: 'enter user date of birth',
          },
          endUserType: {
            type: 'integer',
            require: true,
            default: 1,
            description: 'enter user type 1-athlete 2- Parents',
          },
        },
      },
      userLogin: {
        type: 'object',
        required: ['password', 'deviceId'],
        properties: {
          email: {
            type: 'string',
            description: 'User Email',
          },
          password: {
            type: 'string',
            description: 'User Password',
          },
          deviceId: {
            type: 'string',
            description: 'Users DeviceId',
            // required: true,
          },
        },
      },
      getAuthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'success | error',
          },
          data: {
            type: 'object',
          },
          message: { type: 'string' },
        },
        required: ['status', 'data'],
      },
    },
  },
};

export default authComponent;
