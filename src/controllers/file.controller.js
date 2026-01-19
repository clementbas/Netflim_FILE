import { deleteFile, getFilePath } from '../services/file.service.js';
import { streamVideo } from '../services/streaming.service.js';

export const uploadFile = (req, res) => {
  res.status(201).json({
    success: true,
    file: req.file.filename
  });
};

export const stream = (req, res) => {
  const { filename } = req.params;
  const filePath = getFilePath('videos', filename);

  streamVideo(req, res, filePath);
};

export const removeFile = (req, res) => {
  const { folder, filename } = req.params;
  const filePath = getFilePath(folder, filename);

  deleteFile(filePath);

  res.json({ success: true });
};
