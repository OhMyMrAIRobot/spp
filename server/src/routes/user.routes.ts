import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authorize } from '../middlewares/auth.middleware';
import { UserRoleEnum } from '../types/user/user-role';

const router = Router();

router.get('/', authorize([UserRoleEnum.ADMIN]), userController.getAll);

export default router;
