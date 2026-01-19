import Joi from 'joi';

export const uploadSchema = Joi.object({
  body: Joi.object().optional(),
  params: Joi.object().empty(),
  query: Joi.object().empty()
});

export const streamSchema = Joi.object({
  params: Joi.object({
    filename: Joi.string().min(3).required()
  }),
  body: Joi.object().empty(),
  query: Joi.object().empty()
});

export const deleteSchema = Joi.object({
  params: Joi.object({
    folder: Joi.string().valid('videos', 'images', 'avatars').required(),
    filename: Joi.string().required()
  }),
  body: Joi.object().empty(),
  query: Joi.object().empty()
});
