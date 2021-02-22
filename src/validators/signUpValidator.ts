import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// validate the signup input field with express-validator
const signUpValidator = [
  check('email')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"'),
  check('fname')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "fname"'),
  check('username')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "username"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
  (req: Request, res: Response, next: NextFunction) => {
    // extract error msg if any from nameValidator
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const errorMessages = errors.array().map((error: any) => error.msg);
  
      return res.status(400).json({errors: errorMessages});
    }

    next();
  }
]

export default signUpValidator;