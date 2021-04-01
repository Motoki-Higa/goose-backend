import { Request, Response, NextFunction } from 'express';

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const currentUserId = req.app.locals.currentUser._id;
        const profileName = req.params.username;
        const collection = req.app.locals.db.collection('profiles');
        const user = await collection.findOne({username: profileName});

        res.json(user)

    } catch(err) {
        console.log(err);
    }
}

export default getProfile;