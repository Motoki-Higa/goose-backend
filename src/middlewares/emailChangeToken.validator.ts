import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// validate the reset password form input field with express-validator
const emailChangeTokenValidator = [
    check('newEmail')
        .exists({ checkNull: true, checkFalsy: true })
        .toLowerCase()
        .withMessage('Please provide a value for "New email"'),
    async (req: Request, res: Response, next: NextFunction) => {
        // extract error msg if any from nameValidator
        const errors = validationResult(req);
              
        if (!errors.isEmpty()){
            const errorMessages = errors.array().map((error: any) => error.msg);
            return res.status(400).json({errors: errorMessages});
        }

        // lastly check if email is already in use or not
        const userId = req.params.id;
        const collection = await req.app.locals.db.collection('users');
        const user = await collection.findOne({email: req.body.newEmail});

        if (user){ 
            // if the user found was Not the logged in user, then throw error
            if (String(user._id) !== String(userId)){
                return res.status(400).json({errors: ['Email already in use']});
            }
        } 

        next();
    }
]

export default emailChangeTokenValidator;