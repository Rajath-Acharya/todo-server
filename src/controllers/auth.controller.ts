import { Request, Response, Router } from 'express';
import { RegisterErrorMessage } from '../types/auth.type';
import { createUser } from '../services/auth.service';

const authRouter = Router();

authRouter.get('/login', (req, res) => {
  res.send('hello login');
});

authRouter.post('/register', async (req:Request, res:Response) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      throw new Error(RegisterErrorMessage.EMAIL_NOT_FOUND);
    }
    if (!password) {
      throw new Error(RegisterErrorMessage.PASSWORD_NOT_FOUND);
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

export default authRouter;
