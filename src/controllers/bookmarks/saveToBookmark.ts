import {Request, Response, NextFunction} from 'express';
const { ObjectID } = require('mongodb');

const saveToBookmark = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bookmarks');
        const bookmarkObj = await collection.findOne({user_id: userId});


        /* 
        if there is no users bookmark object in the collection, then create one and save item 
        otherwise, add to existing object.
        */
        if (bookmarkObj){
            const filter = { user_id: ObjectID(userId) };
            const updateDoc = { 
                $addToSet: { 
                    bike_ids: bikeId 
                },
            };

            // update users bookmark obj
            const result = await collection.updateOne(filter, updateDoc);
            console.log(result);
            console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
            res.send({
                message: req.params.id + ' is added to bookmark!',
                id: req.params.id
            });
        } 
        else {
            const bookmarkObj = {
                user_id: userId,
                bike_ids: [bikeId]
            }

            // create a new bookmark obj
            const result = await collection.insertOne(bookmarkObj);
            console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
            res.send({
                message: 'First bike' + req.params.id + ' is saved to bookmark!',
                id: req.params.id
            });
        }

    } catch(err){
        console.log(err);
    }
}

export default saveToBookmark;