import express, { Express } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './controllers/auth.controller';

const app:Express = express();
const PORT = process.env.PORT || 4000;
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use('/api/auth', authRouter);

async function connectDatabase() {
  const mongoURI = process.env.MONGO_URI || '';
  await mongoose.connect(mongoURI);
  console.log('db connected');
}

function listen() {
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });
}

async function startServer() {
  await connectDatabase();
  listen();
}

startServer();
