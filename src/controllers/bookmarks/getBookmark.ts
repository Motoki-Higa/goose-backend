import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.params.userId;
        const collection = req.app.locals.db.collection('bookmarks');
        const user = await collection.findOne({user_id: ObjectID(currentUserId)});

        res.json(user)

    } catch(err) {
        console.log(err);
    }
}

export default getBookmark;