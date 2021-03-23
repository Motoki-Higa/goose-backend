import { Request, Response, NextFunction } from 'express';

const postBike = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        // 1. get info of images which are stored in aws s3
        // 2. get only 'key' and 'location' from each file object
        // * (images as any) solves the issue of gettting 'expression is not callable' on map()
        const images = req.files;
        const imagesData = (images as any).map( (image: any) => {
            return {'key': image.transforms[0].key, 'location': image.transforms[0].location};
        })

        const bikeObj = {
            user_id: req.app.locals.currentUser._id,
            name: req.body.name,
            brand: req.body.brand,
            builtby: req.body.builtby,
            desc: req.body.desc,
            images: imagesData
        }

        if (images.length === 0) {
            console.log('At least one image is required to post a bike!');
        }
        else {
            // store values in db
            const collection = req.app.locals.db.collection('bikes');
            const result = await collection.insertOne(bikeObj);
            console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
        }

        res.send({message: req.body.name + ' is added successfully!'});
        
    } catch(err) {
        console.log(err)
    }
};

export default postBike;