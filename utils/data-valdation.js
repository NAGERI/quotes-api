import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const quoteSchema = Joi.object().keys({
  text: Joi.string().min(5).max(50),
  authorId: Joi.number().integer(),
});
const authorSchema = Joi.object().keys({
  name: Joi.string().min(5).max(50).required(),
  age: Joi.number().integer().min(18),
  password: Joi.string().min(8).required(),
  quoteId: Joi.number().integer(),
  role: Joi.string(),
});

const authorUpdateSchema = Joi.object().keys({
  name: Joi.string().min(5).max(50).required(),
  age: Joi.number().integer().min(18),
  quoteId: Joi.number().integer(),
  role: Joi.string(),
});

const validateReqQuotes = (req, res, next) => {
  const { error } = quoteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors });
  }
  next();
};

const validateReqAuthor = (req, res, next) => {
  const { error } = authorSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors });
  }
  next();
};

const validateUpdateReqAuthor = (req, res, next) => {
  const { error } = authorUpdateSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors });
  }
  next();
};

export {
  quoteSchema,
  authorSchema,
  validateUpdateReqAuthor,
  validateReqQuotes,
  validateReqAuthor,
};
