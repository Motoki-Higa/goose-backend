import {Request, Response, NextFunction} from 'express';
const { ObjectID } = require('mongodb');

const removeFromBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bookmarks');

        const filter = { user_id: ObjectID(userId) };
        const updateDoc = { 
            $pull: { 
                bike_ids: bikeId  
            },
        };

        // update users bookmark obj
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);

        res.send({
            message: req.params.id + ' is removed from bookmark!',
            id: req.params.id
        });

    } catch(err){
        console.log(err);
    }
}

export default removeFromBookmark;