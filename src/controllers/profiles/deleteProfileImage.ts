import { Request, Response, NextFunction } from 'express';
import aws, { AWSError } from 'aws-sdk';
const { ObjectID } = require('mongodb');


const deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.app.locals.currentUser._id;
        const userId = req.params.userId;
        const imageKey = req.params.imageKey;
        const collection = req.app.locals.db.collection('profiles');

        console.log('currentUserId = ' + currentUserId)
        console.log('userId = ' + userId)

        if (currentUserId == userId){

            // ======== Take care of emptying the image key/location in database =========
            // create a filter for a bike to update
            const filter = { user_id: currentUserId };
            // create a document that unsets the selected image
            const updateDoc = {$set: {
                image: {
                    key: "",
                    location: ""
                },
            }};
            const result = await collection.updateMany(filter, updateDoc);
            // ==============================================================


            // ========= Take care of deleting an image from aws s3 =========
            const s3 = new aws.S3({
                secretAccessKey: process.env.S3_ACCESS_SECRET,
                accessKeyId: process.env.S3_ACCESS_KEY,
            });
            const params: any = { 
                Bucket: process.env.S3_BUCKET_GOOSE_PROFILES, 
                'Key': imageKey
            };
            s3.deleteObject(params, (err: AWSError, data: any) => {
                if (err) console.log(err, err.stack);  // error
                else     console.log();                 // deleted
            });
            // ===============================================================

            res.send({ message: 'Image deleted successfully!' });
        } else {
            console.log('Could not identify user')
        }

    } catch(err) {
        console.log(err);
    }
}

export default deleteProfileImage;