import { Router } from 'express';
import { upload } from '../config/mutler.config.js';
import {
  uploadFile,
  stream,
  removeFile
} from '../controllers/file.controller.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/stream/:filename', stream);
router.delete('/:folder/:filename', removeFile);

export default router;
