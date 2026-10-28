import { Request, Response, NextFunction } from 'express';
import { verifyJWTToken } from '../utils/jwtToken';

interface UserRequest extends Request {
  userId?: string;
}

const getCurrentCustomer = async (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  try {
    const decoded = verifyJWTToken(token);
    if (decoded.type !== 'user') {
      return res.status(401).json({ message: 'Access denied' });
    }
    req.userId = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: err });
  }
};

export { getCurrentCustomer, UserRequest };
