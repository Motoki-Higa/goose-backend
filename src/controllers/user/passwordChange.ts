import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');
import bcryptjs from 'bcryptjs';

const passwordChange = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const userId = req.params.id;
        const filter = { _id: ObjectID(userId) };
        const updateDoc = { $set: {
            password: bcryptjs.hashSync(req.body.newpassword)
        }};

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        // findOneAndUpdate() returns updated object *{returnOriginal: false} parameter is necessary
        const result = await collection.findOneAndUpdate(filter, updateDoc, { returnOriginal: false });

        res.send({ 
            message: 'Password is changed!'
        });
    } catch(err) {
        res.json({ message: err });
    }
};

export default passwordChange;