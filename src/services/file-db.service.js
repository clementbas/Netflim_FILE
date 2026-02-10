import { dataService } from '../config/dataService.client.js';

export const saveFileInDb = async ({ path, type, ownerId, categoryId }) => {
  const response = await dataService.post('/files', {
    path,
    type,
    ownerId,
    categoryId
  });

  return response.data;
};

export const getFileFromDb = async (fileId) => {
  const response = await dataService.get(`/files/${fileId}`);
  return response.data;
};

export const deleteFileFromDb = async (fileId) => {
  const response = await dataService.delete(`/files/${fileId}`);
  return response.data;
};