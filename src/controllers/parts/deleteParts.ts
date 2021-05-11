import {Request, Response, NextFunction} from 'express';
const { ObjectID } = require('mongodb');

const deleteParts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.app.locals.currentUser._id;
        const bikeId = req.params.id;
        const parts = req.body.parts;
        const collection = req.app.locals.db.collection('bikes');

        const filter = { 
            _id: ObjectID(bikeId),
            user_id: userId,
        };
        
        const updateDoc = { 
            $unset: { 
                parts: 1
            },
        };

        // update bike obj
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
        res.send({
            message: 'Components are removed successfully',
        });

    } catch(err){
        console.log(err);
    }
}

export default deleteParts;