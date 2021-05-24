import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getProfileById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const collection = req.app.locals.db.collection('profiles');
        const user = await collection.findOne({user_id: ObjectID(userId)});

        res.json(user)

    } catch(err) {
        console.log(err);
    }
}

export default getProfileById;