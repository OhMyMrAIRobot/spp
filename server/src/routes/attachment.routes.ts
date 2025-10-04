import { Router } from 'express';
import { attachmentController } from '../controllers/attachment.controller';
import { uploadMultiple } from '../middlewares/upload.middleware';

const router = Router();

router.get('/tasks/:taskId', attachmentController.listByTask);

router.post(
  '/tasks/:taskId',
  uploadMultiple,
  attachmentController.uploadToTask,
);

router.get('/:id/download', attachmentController.downloadById);

router.delete('/:id', attachmentController.deleteById);

export default router;
