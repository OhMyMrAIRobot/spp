import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { validate } from '../middlewares/validation';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validations/project.validation';

const router = Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', validate(createProjectSchema), projectController.create);
router.patch('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.delete);

export default router;
