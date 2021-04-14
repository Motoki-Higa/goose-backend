import { Request, Response, NextFunction } from 'express';
import aws, { AWSError } from 'aws-sdk';
const { ObjectID } = require('mongodb');

const updateProfile = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const profileId = req.params.id;
        const collection = req.app.locals.db.collection('profiles');

        // 1. get key' and 'location' of image which are stored in aws s3
        const image: any = req.file;
        const imageData = image ? {'key': image.transforms[0].key, 'location': image.transforms[0].location} : null;


        // ======== Take care of updating database =========
        // create a filter for a bike to update
        const filter = { _id: ObjectID(profileId), user_id: req.app.locals.currentUser._id };
        // create a document that unsets the selected image
        let updateDoc;

        // check if imageData exist or not
        if (imageData !== null){
            updateDoc = { $set: {
                bio: req.body.bio,
                website: req.body.website,
                image: imageData
            }};
        } else {
            updateDoc = { $set: {
                bio: req.body.bio,
                website: req.body.website,
            }};
        }
        
        const result = await collection.updateOne(filter, updateDoc);
        // ==============================================================


        // ========= Take care of deleting an image from aws s3 =========
        const s3 = new aws.S3({
            secretAccessKey: process.env.S3_ACCESS_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY,
        });
        const params: any = { 
            Bucket: process.env.S3_BUCKET_GOOSE_PROFILES, 
            'Key': req.body.prevImageKey
        };
        s3.deleteObject(params, (err: AWSError, data: any) => {
            if (err) console.log(err, err.stack);  // error
            else     console.log();                 // deleted
        });
        // ===============================================================

        
        console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
        res.send({message: 'Profile is updated!'});
        
    } catch(err) {
        console.log(err)
    }
};

export default updateProfile;