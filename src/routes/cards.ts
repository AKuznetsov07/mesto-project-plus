import { Router } from 'express';
import { getCards, createCard, deleteCardById } from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:userId', deleteCardById);


export default router;