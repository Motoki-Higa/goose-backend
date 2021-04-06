import { Request, Response, NextFunction } from 'express';

const postProfile = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        // 1. get info of images which are stored in aws s3
        // 2. get only 'key' and 'location' from each file object
        // * (images as any) solves the issue of gettting 'expression is not callable' on map()
        const images = req.files;
        const imagesData = (images as any).map( (image: any) => {
            // console.log(image.transforms);
            return {'key': image.transforms[0].key, 'location': image.transforms[0].location};
        })

        const profileObj = {
            user_id: req.app.locals.currentUser._id,
            username: req.app.locals.currentUser.username,
            bio: req.body.bio,
            website: req.body.website,
            image: imagesData
        }

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