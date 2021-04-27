import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';

const passwordReset = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const resetPasswordToken = req.params.token;

        // create a filter to find user
        const filter = { resetPasswordToken: resetPasswordToken };

        const updateDoc = { $set: {
            password: bcryptjs.hashSync(req.body.newpassword)
        }};

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`Reset password successfully`);
        
        res.send({ 
            message: 'Reset password successfully'
        });
    } catch(err) {
        res.json({ message: err });
    }
};

export default passwordReset;