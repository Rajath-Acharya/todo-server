import {
  NextFunction, Request, Response, Router,
} from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken, verifyToken } from '../helpers/token.helper';
import { AuthErrorMessage } from '../types/auth.type';
import { createUser, verifyUser } from '../services/auth.service';

interface JwtPayload {
  user_id: string
}

const authRouter = Router();

authRouter.post('/register', async (req:Request, res:Response) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      throw new Error(AuthErrorMessage.EMAIL_NOT_FOUND);
    }
    if (!password) {
      throw new Error(AuthErrorMessage.PASSWORD_NOT_FOUND);
    }
    await createUser({
      email,
      password,
    });
    res.status(201).send({ success: true });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

authRouter.post('/login', async (req:Request, res:Response) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      throw new Error(AuthErrorMessage.EMAIL_NOT_FOUND);
    }
    if (!password) {
      throw new Error(AuthErrorMessage.PASSWORD_NOT_FOUND);
    }
    const response = await verifyUser({
      email,
      password,
    });
    const { accessToken, refreshToken } = response;
    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ auth: true, token: response });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

authRouter.post('/token', async (
  req:Request | any,
  res:Response,
) => {
  const secretKey = process.env.REFRESH_TOKEN_KEY || '';
  const { refreshToken } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send(AuthErrorMessage.TOKEN_NOT_FOUND);
  }
  try {
    const decoded = verifyToken(token, secretKey) as JwtPayload;
    if (!decoded) {
      throw new Error(AuthErrorMessage.INVALID_TOKEN);
    }
    const accessToken = await generateAccessToken(
      { user_id: decoded.user_id },
      refreshToken,
    );
    return res.status(200).json({ accessToken });
  } catch (error:any) {
    return res.status(401).json({ error: error.messgae });
  }
});

authRouter.delete('/logout', async (
  req:Request,
  res:Response,
) => {
  res.clearCookie('access_token', {
    httpOnly: true,
  });
  res.clearCookie('refresh_token', {
    httpOnly: true,
  });
  return res.sendStatus(204);
});

export default authRouter;
