import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getMyBike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.app.locals.currentUser._id;
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bikes');
        const cursor = await collection.find({user_id: currentUserId, _id: ObjectID(bikeId)});

        // check if database has data
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        // If require all documents matched by a query to be held in memory at the same time, use toArray()
        cursor.toArray((queryError: string, results: string) => {
            res.json(results);
        })

    } catch(err) {
        console.log(err);
    }
}

export default getMyBike;