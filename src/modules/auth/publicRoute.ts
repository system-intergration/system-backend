import express from 'express';
import AuthController from './controller';

const authPublicRoute = express.Router();
authPublicRoute.get('/login', AuthController.login);
authPublicRoute.get('/register', AuthController.register);

export { authPublicRoute };
