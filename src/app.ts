/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable eol-last */
import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import { Response } from 'express';
import { authRequest } from './common/autorisedRequest';



const port = process.env.port || 3000;

const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log(`${mongoose.connection.db.databaseName}`);
});
app.use('/', usersRouter);



app.use((req: authRequest, res: Response, next) => {
  req.user = {
    _id: '65c93a5634acbaa8d628462d' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
}); 


app.listen(port, () => {
  console.log(`Started at: ${port}`);
});
