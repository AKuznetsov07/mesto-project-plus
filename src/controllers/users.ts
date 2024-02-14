/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from 'express';
import user from '../models/user';
import { authRequest } from '../common/autorisedRequest';
import {
  defaultErrorText,
  IncorrectDataErrorCode,
  NotFoundErrorCode,
  UnhandledErrorCode,
  SuccesOnCreationCode,
} from '../common/constants';

export const getUsers = (req: authRequest, res: Response) => user.find({})
  .then((foundUsers: any) => res.send({ data: foundUsers }))
  .catch((err: { message: any; }) => res.status(UnhandledErrorCode).send({ message: err.message }));

export const getUserById = (req: authRequest, res: Response) => {
  const { id } = req.params;
  return user.findById(id)
    .orFail(new Error('NoUserException'))
    .then((foundUser) => res.send({ data: foundUser }))
    .catch((err) => {
      if (err.message === 'NoUserException') {
        return res.status(NotFoundErrorCode).send('Пользователь по указанному _id не найден.');
      }

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};

export const createUser = (req: authRequest, res: Response) => {
  const { name, about, avatar } = req.body;

  return user.create({ name, about, avatar })
    .then((createdUser) => res.status(SuccesOnCreationCode).send({ data: createdUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при создании пользователя.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};

export const updateUserBioById = (req: authRequest, res: Response) => {
  const _userId = req.user?._id;
  const { name, about } = req.body;
  return user.findOneAndUpdate(
    { _id: _userId },
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NoUserException'))
    .then((foundUser) => res.send({ data: foundUser }))
    .catch((err) => {
      if (err.message === 'NoUserException') return res.status(NotFoundErrorCode).send('Пользователь с указанным _id не найден.');
      if (err.name === 'ValidationError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при обновлении профиля.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};

export const updateUserAvatarById = (req: authRequest, res: Response) => {
  const _userId = req.user?._id;
  const { avatar } = req.body;
  return user.findOneAndUpdate(
    { _id: _userId },
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error('NoUserException'))
    .then((foundUser) => res.send({ data: foundUser }))
    .catch((err) => {
      if (err.message === 'NoUserException') return res.status(NotFoundErrorCode).send('Пользователь с указанным _id не найден.');
      if (err.name === 'ValidationError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при обновлении профиля.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};
