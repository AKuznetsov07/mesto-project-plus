import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUserBioById, updateUserAvatarById } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserBioById);
router.patch('/users/me/avatar', updateUserAvatarById);


export default router;