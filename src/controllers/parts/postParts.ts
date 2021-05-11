import {Request, Response, NextFunction} from 'express';
const { ObjectID } = require('mongodb');

const postParts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.app.locals.currentUser._id;
        const bikeId = req.params.id;
        const parts = req.body.parts;
        const collection = req.app.locals.db.collection('bikes');

        console.log(parts)

        if(parts.length === 0) {
            res.status(400).send({ message: 'At least one component needs to be added'}); 
            return
        }

        const filter = { 
            _id: ObjectID(bikeId),
            user_id: userId,
        };
        
        const updateDoc = { 
            $set: { 
                parts: parts
            },
        };

        // update bike obj
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
        res.send({
            message: 'Components are added successfully',
        });

    } catch(err){
        console.log(err);
    }
}

export default postParts;