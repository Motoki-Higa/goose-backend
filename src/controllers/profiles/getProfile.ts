import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const currentUserId = req.app.locals.currentUser._id;
        const profileName = req.params.profile;
        const collection = req.app.locals.db.collection('profiles');
        const cursor = await collection.find({name: profileName});

        console.log(profileName);

        // check if database has data
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        // If require all documents matched by a query to be held in memory at the same time, use toArray()
        cursor.toArray((queryError: string, results: string) => {
            res.json(results);
        })

    } catch(err) {
        console.log(err);
    }
}

export default getProfile;