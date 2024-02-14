/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from 'express';
import card from '../models/card';
import { authRequest } from '../common/autorisedRequest';
import {
  defaultErrorText,
  IncorrectDataErrorCode,
  NotFoundErrorCode,
  UnhandledErrorCode,
  SuccesOnCreationCode,
} from '../common/constants';

export const getCards = (req: authRequest, res: Response) => card.find({})
  .then((foundCards: any) => res.send({ data: foundCards }))
  .catch((err: { message: any; }) => res.status(UnhandledErrorCode).send({ message: err.message }));

export const createCard = (req: authRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return card.create({ name, link, owner })
    .then((createdCard) => res.status(SuccesOnCreationCode).send({ data: createdCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при создании карточки.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};

export const deleteCardById = (req: authRequest, res: Response) => {
  const { id } = req.params;
  return card.findByIdAndDelete(id)
    .orFail(new Error('NoCardException'))
    .then((foundCard) => res.send({ data: foundCard }))
    .catch((err) => {
      if (err.message === 'NoCardException') return res.status(NotFoundErrorCode).send('Карточка с указанным _id не найдена.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};

export const likeCard = (req: authRequest, res: Response) => {
  const userId = req.user?._id;
  return card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(new Error('NoCardException'))
    .then((foundCard) => res.send({ data: foundCard }))
    .catch((err) => {
      if (err.message === 'NoCardException') return res.status(NotFoundErrorCode).send('Карточка с указанным _id не найдена.');
      if (err.name === 'CastError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные для постановки/снятии лайка.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};

export const dislikeCard = (req: authRequest, res: Response) => {
  const userId = req.user?._id;
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new Error('NoCardException'))
    .then((foundCard) => res.send({ data: foundCard }))
    .catch((err) => {
      if (err.message === 'NoCardException') return res.status(NotFoundErrorCode).send('Карточка с указанным _id не найдена.');
      if (err.name === 'CastError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные для постановки/снятии лайка.');

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText });
    });
};
