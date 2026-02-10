import path from 'path';
import { deleteFile } from '../services/file.service.js';
import { streamVideo } from '../services/streaming.service.js';
import {
  saveFileInDb,
  getFileFromDb,
  deleteFileFromDb
} from '../services/file-db.service.js';
import { ApiError } from '../utils/apiError.js';
import { validateCategoryByName } from '../services/category.service.js';

export const uploadFile = async (req, res) => {
  const filePath = req.file.path;
  const type = req.file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE';
  const { categoryName, category } = req.body;
  const resolvedCategoryName = categoryName || category;

  // Valider que la catégorie existe et récupérer son ID
  const categoryId = await validateCategoryByName(resolvedCategoryName);

  const dbRecord = await saveFileInDb({
    path: filePath,
    type,
    ownerId: req.user.id,
    categoryId
  });

  res.status(201).json({
    success: true,
    file: {
      id: dbRecord.id,
      path: filePath
    }
  });
};

export const stream = async (req, res) => {
  const { id } = req.params;

  const file = await getFileFromDb(id);

  if (!file) {
    throw new ApiError(404, 'Fichier introuvable');
  }

  if (file.type === 'IMAGE') {
    const absolutePath = path.isAbsolute(file.path)
      ? file.path
      : path.join(process.cwd(), file.path);

    res.type(path.extname(file.path));
    res.sendFile(absolutePath);
    return;
  }

  streamVideo(req, res, file.path);
};

export const removeFile = async (req, res) => {
  const { id } = req.params;

  const file = await getFileFromDb(id);

  if (!file) {
    throw new ApiError(404, 'Fichier introuvable');
  }

  // 1️⃣ Supprimer le fichier disque
  deleteFile(file.path);

  // 2️⃣ Supprimer l’entrée en base
  await deleteFileFromDb(id);

  res.json({ success: true });
};
