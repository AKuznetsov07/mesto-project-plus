/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from 'express';
import card from '../models/card';
import user from '../models/user';
import { authRequest } from '../common/autorisedRequest';
import { defaultErrorText, IncorrectDataErrorCode, NotFoundErrorCode, UnhandledErrorCode } from '../common/constants';

export const getCards = (req: authRequest, res: Response) => {
  return card.find({})
    .then((foundCards: any) => res.send({ data: foundCards }))
    .catch((err: { message: any; }) => {
      return res.status(UnhandledErrorCode).send({ message: err.message })
    });
};


export const createCard = (req: authRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return card.create({ name, link, owner })
    .then((createdCard) => res.send({ data: createdCard }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные при создании карточки.')

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText })
    });
};

export const deleteCardById = (req: authRequest, res: Response) => {
  const { id } = req.params;
  return card.findByIdAndDelete(id)
    .then(foundCard => {
      if (!foundCard) {
        const err = new Error();
        err.name = "NoCardException"
        return Promise.reject(err);
      }

      return res.send({ data: foundCard });
    })
    .catch(err => {
      if (err.name === 'NoCardException') return res.status(NotFoundErrorCode).send('Карточка с указанным _id не найдена.')

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText })
    });
};

export const likeCard = (req: authRequest, res: Response) => {
  const userId = req.user?._id;
  return card.findByIdAndUpdate(
      req.params.cardId,
    { $addToSet: { likes: userId } },
      { new: true },
  )
    .then(foundCard => {
      if (!foundCard) {
        const err = new Error();
        err.name = "NoCardException"
        return Promise.reject(err);
      }

      return res.send({ data: foundCard });
    })
    .catch(err => {
      if (err.name === 'CastError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные для постановки/снятии лайка.')
      if (err.name === 'NoCardException') return res.status(NotFoundErrorCode).send('Карточка с указанным _id не найдена.')

      return res.status(UnhandledErrorCode).send({ message: defaultErrorText })
    });
};

export const dislikeCard = (req: authRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  return card.findByIdAndUpdate(
      req.params.cardId,
    { $pull: { likes: userId } },
      { new: true },
  )
    .then(foundCard => {
      if (!foundCard) {
        const err = new Error();
        err.name = "NoCardException"
        return Promise.reject(err);
      }

      return res.send({ data: foundCard });
    })
    .catch(err => {
      if (err.name === 'CastError') return res.status(IncorrectDataErrorCode).send('Переданы некорректные данные для постановки/снятии лайка.')
      if (err.name === 'NoCardException') return res.status(NotFoundErrorCode).send('Передан несуществующий _id карточки.')
      console.log(err)
      return res.status(UnhandledErrorCode).send({ message: defaultErrorText })
    });
};