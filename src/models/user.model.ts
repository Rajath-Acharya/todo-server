import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  user_id: {
    type: 'String', required: true, unique: true, index: true,
  },
  email: {
    type: 'String', required: true, unique: true, index: true,
  },
  password: {
    type: 'String', required: true,
  },
});

const userModel = model('User', userSchema);

export default userModel;
