import express from 'express';
import { config } from './config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware';

import { router as tourRouter } from './routes/tour';
import { router as userRouter } from './routes/user';
import { router as levelRouter } from './routes/level';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(authMiddleware);

// router
app.use('/user', userRouter);
app.use('/tour', tourRouter);
app.use('/level', levelRouter);


app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log('Server is running on port 3000');
});