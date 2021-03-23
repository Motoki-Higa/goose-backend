import { Request, Response, NextFunction } from 'express';

const postItem = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        // 1. get info of images which are stored in aws s3
        // 2. get only 'key' and 'location' from each file object
        // * (images as any) solves the issue of gettting 'expression is not callable' on map()
        const images = req.files;
        const imagesData = (images as any).map( (image: any) => {
            // console.log(image.transforms);
            return {'key': image.transforms[0].key, 'location': image.transforms[0].location};
        })

        // console.log(req.files);

        const itemObj = {
            user_id: req.app.locals.currentUser._id,
            name: req.body.name,
            brand: req.body.brand,
            desc: req.body.desc,
            condition: req.body.condition,
            images: imagesData
        }

        if (images.length === 0) {
            console.log('At least one image is required to post an item!');
        }
        else {
            // store values in db
            const collection = req.app.locals.db.collection('items');
            const result = await collection.insertOne(itemObj);
            console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
        }

        res.send({message: req.body.name + ' is added successfully!'});
        
    } catch(err) {
        console.log(err)
    }
};

export default postItem;