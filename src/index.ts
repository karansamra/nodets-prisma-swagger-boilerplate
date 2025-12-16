import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import * as path from 'path';
import 'reflect-metadata';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../swagger/swaggerDefinition';
import { default as routesV1 } from './v1/routes';
import logger from './v1/utils/logging';

dotenv.config();
const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 3001;

logger.info('Starting API service', {
  environment: process.env.NODE_ENV || 'development',
  port,
});

// Extended: https://swagger.io/specification/#infoObject
let swaggerOptions = {
  swaggerDefinition,
  apis: ['.v1/routes.js'],
};

app.use('/api', routesV1); // Assigning Defined Routes

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () =>
  logger.info('API listening', {
    port,
    url: `http://localhost:${port}`,
    docsUrl: `http://localhost:${port}/api-docs`,
  })
);
