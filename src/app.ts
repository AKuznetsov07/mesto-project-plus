/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable eol-last */
import express, { Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import signRouter from './routes/sign';
import { authRequest } from './common/autorisedRequest';
import { NotFoundErrorCode } from './common/constants';
import exceptionHandler from './middlewares/exceptionHandler';

const port = process.env.port || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => console.log(`${mongoose.connection.db.databaseName}`));
app.use(requestLogger);
app.use('/', signRouter);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req: authRequest, res: Response) => res.status(NotFoundErrorCode).send('Неизвестная страница.'));

app.use(errorLogger);
app.use(errors());

app.use(exceptionHandler);
app.listen(port, () => console.log(`Started at: ${port}`));
