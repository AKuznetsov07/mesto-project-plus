/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Response, NextFunction } from 'express';
import user from '../models/user';
import { authRequest } from '../common/autorisedRequest';
import {
  // defaultErrorText,
  // IncorrectDataErrorCode,
  // NotFoundErrorCode,
  // UnhandledErrorCode,
  SuccesOnCreationCode,
} from '../common/constants';
import NotFoundException from '../common/exceptions/NotFoundException';
import IncorrectDataException from '../common/exceptions/IncorrectDataException';

export const getUsers = (req: authRequest, res: Response, next: NextFunction) => user.find({})
  .then((foundUsers: any) => res.send({ data: foundUsers })).catch(next);

export const getUserById = (req: authRequest, res: Response, next: NextFunction) => {
  const id = req.params.userId === 'me' ? req.user?._id : req.params.userId;
  return user.findById(id)
    .orFail(new Error('NoUserException'))
    .then((foundUser) => res.send({ data: foundUser }))
    .catch((err) => {
      if (err.message === 'NoUserException') return next(new NotFoundException('Пользователь по указанному _id не найден.'));// res.status(NotFoundErrorCode).send('Пользователь по указанному _id не найден.');

      return next(err);
    });
};

export const createUser = (req: authRequest, res: Response, next: NextFunction) => {
  const { name, about, avatar, password, email } = req.body;
  return bcrypt.hash(password, 1).then((hashedPassword) => user
    .create({ name, about, avatar, password: hashedPassword, email })
    .then((createdUser) => res.status(SuccesOnCreationCode).send({ data: createdUser }))
    .catch((err: Error) => {
      if (err.name === 'ValidationError') return next(new IncorrectDataException('Переданы некорректные данные при создании пользователя.'));// return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при создании пользователя.');

      return next(err);
    }));
};

export const updateUserBioById = (req: authRequest, res: Response, next: NextFunction) => {
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
      if (err.message === 'NoUserException') return next(new NotFoundException('Пользователь с указанным _id не найден.'));// return res.status(NotFoundErrorCode).send('Пользователь с указанным _id не найден.');
      if (err.name === 'ValidationError') return next(new IncorrectDataException('Переданы некорректные данные при обновлении профиля.'));// return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при обновлении профиля.');

      return next(err);
    });
};

export const updateUserAvatarById = (req: authRequest, res: Response, next: NextFunction) => {
  const _userId = req.user?._id;
  const { avatar } = req.body;
  return user.findOneAndUpdate(
    { _id: _userId },
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NoUserException'))
    .then((foundUser) => res.send({ data: foundUser }))
    .catch((err) => {
      if (err.message === 'NoUserException') return next(new NotFoundException('Пользователь с указанным _id не найден.'));// return res.status(NotFoundErrorCode).send('Пользователь с указанным _id не найден.');
      if (err.name === 'ValidationError') return next(new IncorrectDataException('Переданы некорректные данные при обновлении профиля.'));// return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при обновлении профиля.');

      return next(err);
    });
};

export const login = (req: authRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((foundUser) => {
      res.send({
        token: jwt.sign({ _id: foundUser._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    }).catch(next);
};
