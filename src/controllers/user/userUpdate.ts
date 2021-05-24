import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const userUpdate = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const userId = req.body._id;

        // ================ update user in users collection =================
        // filter to find user
        const filter = { _id: ObjectID(userId) };
        // get input field data from req.body and store in object
        const user: object = { $set: {
            name: req.body.name,
            username: req.body.username,
        }};

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        // findOneAndUpdate() returns updated object *{returnOriginal: false} parameter is necessary
        const result = await collection.findOneAndUpdate(filter, user, { returnOriginal: false });
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
        // =================================================================



        // ======== update user's profile in profiles collection =========
        // filter to find user
        const filterByUserId = { user_id: ObjectID(userId) };
        // profile
        const updateDoc = { $set: {
            username: req.body.username,
        }};

        // create associate profile database
        const profilesCollection = req.app.locals.db.collection('profiles');
        const profilesResult = await profilesCollection.updateOne(filterByUserId, updateDoc);
        console.log(`${profilesResult.matchedCount} document(s) matched the filter, updated ${profilesResult.modifiedCount} document(s)`,);
        // =================================================================


        const userObj = {
            _id: result.value._id,
            email: result.value.email,
            name: result.value.name,
            username: result.value.username,
        }


        res.send({ 
            message: 'Account is updated!',
            user: userObj
        });

    } catch(err) {
        res.json({ message: err });
    }
};

export default userUpdate;