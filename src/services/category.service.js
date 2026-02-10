import { dataService } from '../config/dataService.client.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Vérifie si une catégorie existe dans le service DATA par son nom
 * @param {string} categoryName - Le nom de la catégorie à vérifier
 * @returns {Promise<number>} - L'ID de la catégorie si elle existe
 * @throws {ApiError} - Si la catégorie n'existe pas
 */
export const validateCategoryByName = async (categoryName) => {
  try {
    // Récupérer toutes les catégories depuis le service DATA
    const response = await dataService.get('/categories');
    const categories = response.data;

    // Chercher la catégorie par nom (insensible à la casse)
    const category = categories.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category) {
      throw new ApiError(400, `La catégorie "${categoryName}" n'existe pas`);
    }

    return category.id;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Erreur de communication avec le service DATA
    throw new ApiError(503, 'Impossible de valider la catégorie. Service DATA indisponible.');
  }
};
