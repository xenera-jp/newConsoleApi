import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error.js';

export default (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      const errorMessage = errors
        .array()
        .map((e) => `${e.msg}`)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(', ');

      return next(ApiError.BadRequest(`${errorMessage}`, errors));
    }

    next();
  };
};
