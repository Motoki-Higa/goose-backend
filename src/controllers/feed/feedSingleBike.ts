import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const feedSingleBike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bikes');
        const bike = await collection.findOne({_id: ObjectID(bikeId)});

        if (!bike){
            res.status(404).json({ message: 'Bike not found' });
        }

        res.json(bike);

    } catch(err) {
        console.log(err);
    }
}

export default feedSingleBike;