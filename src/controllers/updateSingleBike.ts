import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const updateSingleBike = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bikes');

        // 1. get info of images which are stored in aws s3
        // 2. get only 'key' and 'location' from each file object
        // * (images as any) solves the issue of gettting 'expression is not callable' on map()
        const images = req.files;
        const imagesData = (images as any).map( (image: any) => {
            return {'key': image.key, 'location': image.location};
        })

        // ======== Take care of deleting an image from database =========
        // create a filter for a bike to update
        const filter = { _id: ObjectID(bikeId) };
        // create a document that unsets the selected image
        const updateDoc = {
            $set: {
                name: req.body.name,
                brand: req.body.brand,
                builtby: req.body.builtby,
                desc: req.body.desc,
            },
            $addToSet: { images: { $each: imagesData } },
        };
        const result = await collection.updateOne(filter, updateDoc);
        // ==============================================================


        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);

        res.send({message: 'Success!'});
        
    } catch(err) {
        console.log(err)
    }
};

export default updateSingleBike;