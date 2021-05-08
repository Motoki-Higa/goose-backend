import {Request, Response, NextFunction} from 'express';

const unFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.app.locals.currentUser._id;
        const followingId = req.params.id;
        const collection = req.app.locals.db.collection('following');
        const followingObj = await collection.findOne({user_id: userId});

        const filter = { user_id: userId };
        const updateDoc = { 
            $pull: { 
                following_ids: followingId  
            },
        };

        // update users bookmark obj
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);

        res.send({
            message: req.params.id + ' is removed from following!',
            id: req.params.id
        });

    } catch(err){
        console.log(err);
    }
}

export default unFollow;