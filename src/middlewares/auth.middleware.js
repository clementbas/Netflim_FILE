import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export const authenticate = (req, res, next) => {
  if (!env.jwtEnabled) {
    return next(); // sécurité désactivée (dev / tests)
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token manquant ou invalide');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // on stocke l’utilisateur dans la requête
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (err) {
    throw new ApiError(401, 'Token invalide ou expiré');
  }
};
