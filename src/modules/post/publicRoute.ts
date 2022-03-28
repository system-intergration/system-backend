import express from 'express';
import PublicController from './PublicController';
const publicPostRoute = express.Router();
publicPostRoute.get('/post/list', PublicController.getAllPost);
publicPostRoute.get('/post/user/list', PublicController.getAllOfUserPost);
publicPostRoute.get('/post/detail/:post_id', PublicController.getPostDetail);
export { publicPostRoute };
