import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');
import bcryptjs from 'bcryptjs';

const passwordChange = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const userId = req.params.id;
        const userObj = {
            _id: req.app.locals.currentUser._id,
            email: req.app.locals.currentUser.email,
            name: req.app.locals.currentUser.name,
            username: req.app.locals.currentUser.username,
        }

        // create a filter to find user
        const filter = { _id: ObjectID(userId) };

        const updateDoc = { $set: {
            password: bcryptjs.hashSync(req.body.newpassword)
        }};

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`Password is changed`);

        
        // ************ IMPORTANT ************
        // update req.app.locals.currentUser
        req.app.locals.currentUser = {
            _id: req.app.locals.currentUser._id,
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: bcryptjs.hashSync(req.body.newpassword)
        };
        // ***********************************

        
        res.send({ 
            message: 'Password is changed!',
            user: userObj
        });
    } catch(err) {
        res.json({ message: err });
    }
};

export default passwordChange;