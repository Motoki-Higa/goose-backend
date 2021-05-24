import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// validate the signup input field with express-validator
const userEditValidator = [
    check('name')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "name"'),
    check('username')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "username"')
        .toLowerCase(),
    async (req: Request, res: Response, next: NextFunction) => {
        // extract error msg if any from nameValidator
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const errorMessages = errors.array().map((error: any) => error.msg);
            return res.status(400).json({errors: errorMessages});
        };

        // lastly check if username is already taken or not
        const username = req.params.username;
        const collection = req.app.locals.db.collection('users');
        const user = await collection.findOne({username: req.body.username});
              
        if (user) { 
            if (String(user.username) !== String(username)){
                return res.status(400).json({errors: ['Username is already taken']});
            }
        } 

        next();
    }
]

export default userEditValidator;