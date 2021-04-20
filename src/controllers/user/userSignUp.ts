import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';

const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get input field data from req.body and store in object
        const user: object = {
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: bcryptjs.hashSync(req.body.password)
        };

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.insertOne(user);
        console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);

        // profile
        const profileObj = {
            user_id: result.insertedId,
            username: req.body.username,
            bio: "",
            website: "",
            image: {
                key: "",
                location: ""
            }
        }

        // create associate profile database
        const profilesCollection = req.app.locals.db.collection('profiles');
        const profilesResult = await profilesCollection.insertOne(profileObj);
        console.log(`Associate profile object was inserted`);

        return res.status(201).end();
    } catch(err) {
        res.json({ message: err });
    }
};

export default userSignUp;