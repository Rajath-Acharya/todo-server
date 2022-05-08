import { hash } from 'bcrypt';
import { nanoid } from 'nanoid';
import { RegisterErrorMessage } from '../types/auth.type';
import User from '../models/user.model';

interface RegisterPayload {
  email: string,
  password: string
}

async function findUserByEmail(email:string) {
  const user = await User.findOne({ email });
  return user;
}

async function createUser(payload:RegisterPayload) {
  const { email, password } = payload;
  const userResponse = await findUserByEmail(email);
  if (userResponse) {
    throw new Error(RegisterErrorMessage.USER_EXISTS);
  }
  const hashedPassword = await hash(password, 10);
  const userId = nanoid();
  const user = await User.create({
    user_id: userId,
    email,
    password: hashedPassword,
  });
  return user;
}

export { createUser };
