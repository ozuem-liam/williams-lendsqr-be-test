import BaseJoi, { ObjectSchema, ValidationResult } from 'joi';
import JoiDate from '@joi/date';
import { IUser } from '../../../types/user';

const Joi = BaseJoi.extend(JoiDate);

export const validateCreateUser = (user: IUser): ValidationResult<IUser> => {
  const schema: ObjectSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().min(11).max(14).required(),
    email: Joi.string().required(),
    password: Joi.string()
      .min(7)
      .max(100)
      .pattern(new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/))
      .required()
      .messages({
        'string.base': `Password should be a type of 'text'`,
        'string.min': `Password must have at least 7 characters`,
        'string.max': `Password must have at most 100 characters`,
        'string.empty': `Password cannot be an empty field`,
        'any.required': `Password is a required field`,
        'string.pattern.base': `Password must contain an uppercase letter, a lowercase letter, and a number`,
      }),
  }).required();

  return schema.validate(user);
};

export const validateLoginUser = (user: IUser): ValidationResult<IUser> => {
  const schema: ObjectSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).required();

  return schema.validate(user);
};