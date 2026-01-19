import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import fileRoutes from './routes/file.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', fileRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`📁 File Service running on port ${env.port}`);
});
