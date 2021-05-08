import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getAllFollowingUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followingIds = req.body.followingIds;
        const collection = req.app.locals.db.collection('profiles');

        const findObj = {
            user_id: { $in: followingIds.map( (id: string) => ObjectID(id)) }
        };

        const cursor = await collection.find(findObj);

        // check if database has data
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        // If require all documents matched by a query to be held in memory at the same time, use toArray()
        cursor.toArray((queryError: string, results: string) => {
            res.json(results);
        })
    } catch(err) {
        res.json({ message: err});
    }
};

export default getAllFollowingUsers;