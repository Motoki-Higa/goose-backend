import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getSavedBikes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bikeIds = req.body.bikeIds;
        const collection = req.app.locals.db.collection('bikes');

        const findObj = {
            public: 'true',
            _id: { $in: bikeIds.map( (id: string) => ObjectID(id)) }
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

export default getSavedBikes;