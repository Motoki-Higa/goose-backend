import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getProfileByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username;
        const collection = req.app.locals.db.collection('profiles');
        const user = await collection.findOne({username: username});

        res.json(user)

    } catch(err) {
        console.log(err);
    }
}

export default getProfileByUsername;