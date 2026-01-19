import multer from 'multer';
import path from 'path';
import { env } from './env.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'others';

    if (file.mimetype.startsWith('video')) folder = 'videos';
    if (file.mimetype.startsWith('image')) folder = 'images';

    cb(null, path.join(env.uploadDir, folder));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('video') ||
    file.mimetype.startsWith('image')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSize
  }
});
