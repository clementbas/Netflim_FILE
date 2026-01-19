import { ApiError } from '../utils/apiError.js';

export const validate = (schema) => (req, res, next) => {
  const data = {
    body: req.body,
    params: req.params,
    query: req.query
  };

  const { error } = schema.validate(data, {
    abortEarly: false
  });

  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    throw new ApiError(400, message);
  }

  next();
};
