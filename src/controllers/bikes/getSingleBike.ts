import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getSingleBike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bikes');
        const bike = await collection.findOne({user_id: ObjectID(userId), _id: ObjectID(bikeId)});

        res.json(bike);

    } catch(err) {
        console.log(err);
    }
}

export default getSingleBike;