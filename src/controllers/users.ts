/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import card from '../models/card';
import user from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then((foundUsers: any) => res.send({ data: foundUsers }))
    .catch((err: { message: any; }) => res.status(500).send({ message: err.message }));
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  return user.findById(id)
    .then(foundUser => res.send({ data: foundUser }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return user.create({ name, about, avatar })
    .then((createdUser) => res.send({ data: createdUser }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};