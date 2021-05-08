import {Request, Response, NextFunction} from 'express';

const follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.app.locals.currentUser._id;
        const followingId = req.params.id;
        const collection = req.app.locals.db.collection('following');
        const followingObj = await collection.findOne({user_id: userId});


        /* 
        if there is no users bookmark object in the collection, then create one and save item 
        otherwise, add to existing object.
        */
        if (followingObj){
            const filter = { user_id: userId };
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
            const followingObj = {
                user_id: userId,
                following_ids: [followingId]
            }

            // create a new bookmark obj
            const result = await collection.insertOne(followingObj);
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