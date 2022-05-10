// import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  user_id: string,
}

function generateToken(payload: JwtPayload, secretKey:string, expiry:string) {
  return jwt.sign(payload, secretKey, { expiresIn: expiry });
}

function generateAccessToken(payload:JwtPayload, expiry:string) {
  const secretKey = process.env.ACCESS_TOKEN_KEY || '';
  return generateToken(payload, secretKey, expiry);
}

function generateRefreshToken(payload:JwtPayload, expiry:string) {
  const secretKey = process.env.REFRESH_TOKEN_KEY || '';
  return generateToken(payload, secretKey, expiry);
}

function verifyToken(token:string, secret:string) {
  return jwt.verify(token, secret);
}

export {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
