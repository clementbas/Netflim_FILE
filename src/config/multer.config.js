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
    const { categoryName, category, folder = 'default' } = req.body;
    const resolvedCategory = categoryName || category || 'others';

    const uploadPath = path.join(
      env.uploadDir,
      resolvedCategory,
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
