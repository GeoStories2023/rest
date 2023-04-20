import express, { Application } from 'express';
import { config } from './config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import cors from 'cors';
var cors = require('cors')
import { authMiddleware } from './middleware';

import { router as toursRouter } from './routes/tours';
import { router as usersRouter } from './routes/users';
import { router as levelsRouter } from './routes/levels';
import { router as citiesRouter } from './routes/cities';
import { router as countriesRouter } from './routes/countries';
import { router as continentsRouter } from './routes/continents';
import { router as tourPointTypesRouter } from './routes/tourPointTypes';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(authMiddleware);

// router
app.use('/users', usersRouter);
app.use('/tours', toursRouter);
app.use('/levels', levelsRouter);
app.use('/cities', citiesRouter);
app.use('/countries', countriesRouter);
app.use('/continents', continentsRouter);
app.use('/tourpointtypes', tourPointTypesRouter);



app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log('Server is running on port 3000');
});