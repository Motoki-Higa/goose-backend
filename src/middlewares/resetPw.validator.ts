import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// validate the reset password form input field with express-validator
const resetPwValidator = [
    check('email')
        .exists({ checkNull: true, checkFalsy: true })
        .toLowerCase()
        .withMessage('Please provide a value for "email"')
        .custom(async (value, {req}) => { 
            // this custom function checks if email is already in use or not
            const collection = req.app.locals.db.collection('users');
            const user = await collection.findOne({email: value});
                  
            if (!user) { 
                throw new Error('Email not registered');
            }

            if (user.status === 'pending'){
                throw new Error('Email is not verified yet');
            }
        }),
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

export default resetPwValidator;