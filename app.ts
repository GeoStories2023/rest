import express from 'express';
import { config } from './config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authMiddleware } from './middleware';

import { router as tourRouter } from './routes/tours';
import { router as userRouter } from './routes/user';
import { router as levelRouter } from './routes/levels';
import { router as cityRouter } from './routes/cities';
import { router as countryRouter } from './routes/countries';
import { router as continentRouter } from './routes/continents';
import { router as tourPointTypeRouter } from './routes/tourPointTypes';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(authMiddleware);

// router
app.use('/users', userRouter);
app.use('/tours', tourRouter);
app.use('/levels', levelRouter);
app.use('/cities', cityRouter);
app.use('/countries', countryRouter);
app.use('/continents', continentRouter);
app.use('/tourpointtypes', tourPointTypeRouter);



app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log('Server is running on port 3000');
});