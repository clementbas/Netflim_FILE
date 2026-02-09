import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import fileRoutes from './routes/file.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

app.use(cors());
app.use(express.json());

app.get('/api-docs', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
