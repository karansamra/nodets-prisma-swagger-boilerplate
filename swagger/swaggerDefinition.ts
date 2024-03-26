import square from './docs/square/index';
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
      url: '/api/v1.0.0/',
      description: 'Version-1.0.0',
    },
  ],
  paths: { ...square },
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
