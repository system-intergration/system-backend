import _toString from 'lodash/toString';
import { NextFunction, Response, Request } from 'express';
import { totp } from 'otplib';

export const otpMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = req.query;
    const { email } = req.session;
    console.log('auth middleware');
    console.log(otp, email);

    if (!otp || otp.length !== 6) {
      throw new Error('OTP is invalid');
    }

    const isSafeOtp = totp.check(_toString(otp), email || '');
    if (!isSafeOtp) {
      throw new Error('OTP is incorrect');
    }
    next();
    return true;
  } catch (error) {
    console.log(error.message);

    return res.status(400).json({
      message: error.message,
    });
  }
};
