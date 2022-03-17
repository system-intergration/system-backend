import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).send({
        message: 'Token is empty',
      });
    }
    jwt.verify(token, process.env.SECRET_KEY || '', (err, user) => {
      if (err) {
        throw new Error('Token ís invalid');
      }
      req.session = user as UserInfo;
      next();
    });

    return true;
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};