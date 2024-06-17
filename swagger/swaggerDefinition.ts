import auth from './docs/auth/index';
const swaggerDefinition: any = {
  openapi: '3.0.3',
  info: {
    title: 'APIs',
    description: 'This includes the all the APIs.',
    contact: {
      name: 'Engineering Team',
    },
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api/v1/',
      description: 'Version-1',
    },
  ],
  paths: { ...auth },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export default swaggerDefinition;
