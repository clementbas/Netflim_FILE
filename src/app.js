import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { env } from './config/env.js';
import fileRoutes from './routes/file.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

const baseUploadDir = env.uploadDir;
const requiredUploadDirs = [
  baseUploadDir,
  `${baseUploadDir}/images`,
  `${baseUploadDir}/videos`
];

requiredUploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use('/files', fileRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`📁 File Service running on port ${env.port}`);
});
