import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const feedSingleBike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bikes');
        const bike = await collection.findOne({_id: ObjectID(bikeId)});

        // // check if database has data
        // if ((await cursor.count()) === 0) {
        //     console.log("No documents found!");
        // }

        // // If require all documents matched by a query to be held in memory at the same time, use toArray()
        // cursor.toArray((queryError: string, results: string) => {
        //     res.json(results);
        // })

        res.json(bike);

    } catch(err) {
        console.log(err);
    }
}

export default feedSingleBike;