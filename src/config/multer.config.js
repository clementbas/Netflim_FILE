import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from './env.js';

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category = 'others', folder = 'default' } = req.body;

    let type = 'others';
    if (file.mimetype.startsWith('video')) type = 'videos';
    if (file.mimetype.startsWith('image')) type = 'images';

    const uploadPath = path.join(
      env.uploadDir,
      type,
      category,
      folder
    );

    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });
