import { Request, Response, NextFunction } from 'express';
import aws, { AWSError } from 'aws-sdk';
const { ObjectID } = require('mongodb');


const deleteMyBike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.app.locals.currentUser._id;
        const bikeId = req.params.id;
        const collection = req.app.locals.db.collection('bikes');
        const item = await collection.findOne({user_id: currentUserId, _id: ObjectID(bikeId)});
        const imageKeys = item.images.map((image: { key: string; }) => { 
            return { 'Key': image.key } 
        });

        // console.log(imageKeys);

        // ===== Take care of deleting an item from database ======
        const itemToDelete = collection.deleteOne({user_id: currentUserId, _id: ObjectID(bikeId)});
        // ==============================================================

        // ===== Take care of deleting a file(such as image) from aws s3 ======
        const s3 = new aws.S3({
            secretAccessKey: process.env.S3_ACCESS_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY,
        });

        const params: any = { 
            Bucket: process.env.S3_BUCKET, 
            Delete: {
                Objects: imageKeys
            }
        };
        s3.deleteObjects(params, (err: AWSError, data: any) => {
            if (err) console.log(err, err.stack);  // error
            else     console.log();                 // deleted
        });
        // =====================================================================

        console.log(`${itemToDelete.deletedCount} item was deleted`,);

        res.send({ message: 'Success' });
    } catch(err) {
        console.log(err);
    }
}

export default deleteMyBike;