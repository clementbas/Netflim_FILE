import fs from 'fs';
import path from 'path';
import { ApiError } from '../utils/apiError.js';

export const deleteFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, 'Fichier introuvable');
  }

  fs.unlinkSync(filePath);
};

export const getFilePath = (folder, filename) => {
  return path.join('uploads', folder, filename);
};
