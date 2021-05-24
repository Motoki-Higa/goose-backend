import {Request, Response, NextFunction} from 'express';
const { ObjectID } = require('mongodb');

const follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const followingId = req.params.id;
        const collection = req.app.locals.db.collection('following');
        const followingObj = await collection.findOne({user_id: userId});


        /* 
        if there is no users bookmark object in the collection, then create one and save item 
        otherwise, add to existing object.
        */
        if (followingObj){
            const filter = { user_id: ObjectID(userId) };
            const updateDoc = { 
                $addToSet: { 
                    following_ids: followingId 
                },
            };

            // update users bookmark obj
            const result = await collection.updateOne(filter, updateDoc);
            console.log(result);
            console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
            res.send({
                message: req.params.id + ' is added to following!',
                id: req.params.id
            });
        } 
        else {
            const obj = {
                user_id: userId,
                following_ids: [followingId]
            }

            // create a new bookmark obj
            const result = await collection.insertOne(obj);
            console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
            res.send({
                message: 'First following user: ' + req.params.id + ' is saved!',
                id: req.params.id
            });
        }

    } catch(err){
        console.log(err);
    }
}

export default follow;