import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getSingleItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.id;
        const collection = req.app.locals.db.collection('items');
        const item = await collection.findOne({user_id: ObjectID(userId), _id: ObjectID(itemId)});

        res.json(item);

    } catch(err) {
        console.log(err);
    }
}

export default getSingleItem;