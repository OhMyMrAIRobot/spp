import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation';
import { UserRoleEnum } from '../types/user/user-role';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validations/task.validation';

const router = Router();

router.get('/', authorize([UserRoleEnum.ADMIN]), taskController.getAll);

router.get('/:id', taskController.getById);

router.get('/project/:projectId', taskController.getByProject);

router.post('/', validate(createTaskSchema), taskController.create);

router.patch('/:id', validate(updateTaskSchema), taskController.update);

router.delete('/:id', taskController.delete);

export default router;
