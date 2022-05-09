import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  user_id: {
    type: 'String',
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: 'String',
    required: true,
    unique: true,
    index: true,
    validate: {
      validator(v:any) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  password: {
    type: 'String',
    required: true,
  },
});

const userModel = model('User', userSchema);

export default userModel;
