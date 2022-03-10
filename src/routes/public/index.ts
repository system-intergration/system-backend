import express from 'express';
import { authPublicRoute } from '../../modules';

const publicRoute = express.Router();
publicRoute.use('/', authPublicRoute);

export { publicRoute };
