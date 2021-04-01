import { Request, Response, NextFunction } from 'express';

const postProfile = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const profileObj = {
            user_id: req.app.locals.currentUser._id,
            name: req.app.locals.currentUser.name,
            bio: req.body.bio
        }

        console.log(req.body.bio);

        // store values in db
        const collection = req.app.locals.db.collection('profiles');
        const result = await collection.insertOne(profileObj);
        console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
        res.send({message: req.body.bio + ' is added successfully!'});
        
    } catch(err) {
        console.log(err)
    }
};

export default postProfile;