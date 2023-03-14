import express from 'express';
import { config } from './config';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', authMiddleware, async (req, res) => {
  res.send('Hello World2!');
});

app.listen(config.port, () => {
  console.log('Server is running on port 3000');
});