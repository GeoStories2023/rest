import express from 'express';
import { config } from './config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// var cors = require('cors')
import { authMiddleware } from './middleware';

import { router as toursRouter } from './routes/tours';
import { router as usersRouter } from './routes/users';
import { router as levelsRouter } from './routes/levels';
import { router as citiesRouter } from './routes/cities';
import { router as countriesRouter } from './routes/countries';
import { router as continentsRouter } from './routes/continents';
import { router as tourPointTypesRouter } from './routes/tourPointTypes';
import { router as diariesRouter } from './routes/diaries';
import { router as debugRouter } from './routes/debug';
import { router as newsRouter } from './routes/news';

const app = express();

app.use(cors({
  origin: '*',
}));

// header allow content type
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(authMiddleware);

// router
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/levels', levelsRouter);
app.use('/api/v1/cities', citiesRouter);
app.use('/api/v1/countries', countriesRouter);
app.use('/api/v1/continents', continentsRouter);
app.use('/api/v1/tourpointtypes', tourPointTypesRouter);
app.use('/api/v1/diaries', diariesRouter);
app.use('/api/v1/debug', debugRouter);
app.use('/api/v1/news', newsRouter);



app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log('Server is running on port 3000');
});