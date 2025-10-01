import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation';
import { UserRoleEnum } from '../types/user/user-role';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validations/project.validation';

const router = Router();

router.get('/', projectController.getAll);

router.get('/:id', projectController.getById);

router.post(
  '/',
  authorize([UserRoleEnum.ADMIN]),
  validate(createProjectSchema),
  projectController.create,
);

router.patch(
  '/:id',
  authorize([UserRoleEnum.ADMIN]),
  validate(updateProjectSchema),
  projectController.update,
);

router.delete(
  '/:id',
  authorize([UserRoleEnum.ADMIN]),
  projectController.delete,
);

export default router;
