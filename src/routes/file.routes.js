import { Router } from 'express';
import { upload } from '../config/multer.config.js';
import {
  uploadFile,
  stream,
  removeFile
} from '../controllers/file.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

import { validate } from '../middlewares/validation.middleware.js';
import {
  uploadSchema,
  streamSchema,
  deleteSchema
} from '../validations/file.validation.js';

const router = Router();

// Upload protégé
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  validate(uploadSchema),
  uploadFile
);

router.get(
  '/:id/stream',
  authenticate,
  stream
);

router.delete(
  '/:id',
  authenticate,
  removeFile
);

export default router;