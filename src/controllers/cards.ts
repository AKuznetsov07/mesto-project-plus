/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import card from '../models/card';
import user from '../models/user';

export const getCards = (req: Request, res: Response) => {
  return card.find({})
    .then((foundCards: any) => res.send({ data: foundCards }))
    .catch((err: { message: any; }) => res.status(500).send({ message: err.message }));
};


export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  return card.create({ name, link })
    .then((createdCard) => res.send({ data: createdCard }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCardById = (req: Request, res: Response) => {
  const { id } = req.params;
  card.findByIdAndDelete(id)
    .then(foundCard => res.send({ data: foundCard }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};