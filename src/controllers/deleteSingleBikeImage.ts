import { Request, Response, NextFunction } from 'express';
import aws, { AWSError } from 'aws-sdk';
const { ObjectID } = require('mongodb');


const deleteSingleBikeImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.app.locals.currentUser._id;
        const bikeId = req.params.id;
        const imageKey = req.body.key;
        const collection = req.app.locals.db.collection('bikes');


        // ======== Take care of deleting an image from database =========
        // create a filter for a bike to update
        const filter = { _id: ObjectID(bikeId) };
        // create a document that unsets the selected image
        const updateDoc = {
            $pull: { images: { key: imageKey } },
        };
        console.log(JSON.stringify(imageKey));
        const result = await collection.updateMany(filter, updateDoc);
        // ==============================================================


        // ========= Take care of deleting an image from aws s3 =========
        const s3 = new aws.S3({
            secretAccessKey: process.env.S3_ACCESS_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY,
        });
        const params: any = { 
            Bucket: process.env.S3_BUCKET, 
            'Key': imageKey
        };
        s3.deleteObject(params, (err: AWSError, data: any) => {
            if (err) console.log(err, err.stack);  // error
            else     console.log();                 // deleted
        });
        // ===============================================================


        console.log( `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
        res.send({ message: 'Success' });
    } catch(err) {
        console.log(err);
    }
}

export default deleteSingleBikeImage;