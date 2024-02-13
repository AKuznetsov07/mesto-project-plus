/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from 'express';
import card from '../models/card';
import user from '../models/user';
import { authRequest } from '../common/autorisedRequest';

export const getUsers = (req: authRequest, res: Response) => {
  return user.find({})
    .then((foundUsers: any) => res.send({ data: foundUsers }))
    .catch((err: { message: any; }) => res.status(500).send({ message: err.message }));
};

export const getUserById = (req: authRequest, res: Response) => {
  const { id } = req.params;
  return user.findById(id)
    .then(foundUser => res.send({ data: foundUser }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: authRequest, res: Response) => {
  const { name, about, avatar } = req.body;

  return user.create({ name, about, avatar })
    .then((createdUser) => res.send({ data: createdUser }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateUserBioById = (req: authRequest, res: Response) => {
  const _userId = req.user?._id;
  const { name, about } = req.body;
  return user.findOneAndUpdate({ _id: _userId },
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      //upsert: true // если пользователь не найден, он будет создан
    })
    .then(foundUser => res.send({ data: foundUser }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const updateUserAvatarById = (req: authRequest, res: Response) => {
  const _userId = req.user?._id;
  const { avatar } = req.body;
  return user.findOneAndUpdate({ _id: _userId },
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then(foundUser => res.send({ data: foundUser }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};
