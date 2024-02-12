import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);


export default router;