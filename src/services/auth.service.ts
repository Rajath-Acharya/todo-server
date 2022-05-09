import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { Request, Response, NextFunction } from 'express';
import { generateAccessToken, generateRefreshToken, verifyToken }
  from '../helpers/token.helper';
import { AuthErrorMessage } from '../types/auth.type';
import User from '../models/user.model';

 interface RegisterPayload {
  email: string,
  password: string
}

interface JwtPayload {
  user_id: string
}

async function findUserByEmail(email:string) {
  const user = await User.findOne({ email });
  return user;
}

async function verifyPassword(enteredPassword:string, userPassword: string) {
  return compare(enteredPassword, userPassword);
}

async function createUser(payload:RegisterPayload) {
  const { email, password } = payload;
  const user = await findUserByEmail(email);
  if (user) {
    throw new Error(AuthErrorMessage.USER_EXISTS);
  }
  const hashedPassword = await hash(password, 10);
  const userId = nanoid();
  const newUser = await User.create({
    user_id: userId,
    email,
    password: hashedPassword,
  });
  return newUser;
}

async function verifyUser(payload:RegisterPayload) {
  const { email, password } = payload;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error(AuthErrorMessage.USER_DOESNOT_EXIST);
  }
  const isValidUser = await verifyPassword(password, user.password);
  if (!isValidUser) {
    throw new Error(AuthErrorMessage.INVALID_PASSWORD);
  }
  const jwtPayload = {
    user_id: user.user_id,
  };
  const accessToken = generateAccessToken(jwtPayload, '15m');
  const refreshToken = generateRefreshToken(jwtPayload, '30d');
  return {
    accessToken,
    refreshToken,
  };
}

function authorization(
  req:Request & JwtPayload,
  res:Response,
  next:NextFunction,
) {
  const secretKey = process.env.ACCESS_TOKEN_KEY || '';
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const response = jwt.verify(token, secretKey) as JwtPayload;
    req.user_id = response.user_id;
    return next();
  } catch {
    return res.sendStatus(403);
  }
}

export {
  createUser,
  verifyUser,
  authorization,
};
