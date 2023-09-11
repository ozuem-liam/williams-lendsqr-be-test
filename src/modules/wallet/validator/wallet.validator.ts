import BaseJoi, { ObjectSchema, ValidationResult } from 'joi';
import JoiDate from '@joi/date';

const Joi = BaseJoi.extend(JoiDate);

export const validateTransferPayload = (transfer: any): ValidationResult<any> => {
    const schema: ObjectSchema = Joi.object({
      receiver_user_id: Joi.string().required(),
      amount: Joi.number().required(),
    }).required();
  
    return schema.validate(transfer);
  };
export const validateFundPayload = (fund: any): ValidationResult<any> => {
    const schema: ObjectSchema = Joi.object({
      account_number: Joi.string().required(),
      amount: Joi.number().required()
    }).required();
  
    return schema.validate(fund);
  };
export const validateWithdrawPayload = (withdraw: any): ValidationResult<any> => {
    const schema: ObjectSchema = Joi.object({
      account_number: Joi.string().required(),
      recieving_bank_account_number: Joi.string().required(),
      recieving_bank_code: Joi.string().required(),
      amount: Joi.number().required(),
    }).required();
  
    return schema.validate(withdraw);
  };