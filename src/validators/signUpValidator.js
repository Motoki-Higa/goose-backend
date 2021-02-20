const { check, validationResult } = require('express-validator');

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
  (req, res, next) => {
    // extract error msg if any from nameValidator
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const errorMessages = errors.array().map(error => error.msg);
  
      return res.status(400).json({errors: errorMessages});
    }

    next();
  }
]

module.exports = signUpValidator;