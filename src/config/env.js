import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4003,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 500_000_000
};
