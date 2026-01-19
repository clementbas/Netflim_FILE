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

// Streaming (au choix : protégé ou non)
router.get(
  '/stream/:filename',
  authenticate,
  validate(streamSchema),
  stream
);

// Suppression protégée
router.delete(
  '/:folder/:filename',
  authenticate,
  validate(deleteSchema),
  removeFile
);

export default router;