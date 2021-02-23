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

        // store values in db
        const collection = req.app.locals.db.collection('users');
        const result = await collection.insertOne(user);
        console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);

        return res.status(201).end();
    } catch(err) {
        res.json({ message: err });
    }
};

export default userSignUp;