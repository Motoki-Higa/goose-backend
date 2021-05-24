import { Request, Response, NextFunction } from 'express';
import aws, { AWSError } from 'aws-sdk';
const { ObjectID } = require('mongodb');

const userDelete = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const currentUserId = req.params.id;
        
        const s3 = new aws.S3({
            secretAccessKey: process.env.S3_ACCESS_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY,
        });

        /***** Delete SUB databases which connected by user id *****/
        // ========= delete user's bikes =========
        const bikeCollection = req.app.locals.db.collection('bikes');
        const bikes = await bikeCollection.find({user_id: currentUserId}).toArray();

        // this array will be used to delete files from aws later
        let bikeImageKeyArr: any = [];
        bikes.forEach((bike: any) => {
            bike.images.forEach((image: { key: string; }) => { 
                bikeImageKeyArr.push({ 'Key': image.key });
            });
        })

        // delete bike object from database
        const deletedBikes = await bikeCollection.deleteMany({user_id: currentUserId});
        if (deletedBikes.deletedCount > 0){
            console.log(`User's ${ deletedBikes.deletedCount } bike(s) are deleted`);

            // delete files from aws s3
            const bikeDeleteRequest: any = { 
                Bucket: process.env.S3_BUCKET_GOOSE_BIKES, 
                Delete: {
                    Objects: bikeImageKeyArr
                }
            };
            s3.deleteObjects(bikeDeleteRequest, (err: AWSError, data: any) => {
                if (err) console.log(err, err.stack);  // error
                else     console.log();                 // deleted
            });
        }
        // =======================================

        

        // ========= delete user's items =========
        const itemCollection = req.app.locals.db.collection('items');
        const items = await itemCollection.find({user_id: currentUserId}).toArray();

        // this array will be used to delete files from aws later
        let itemImageKeyArr: any = [];
        items.forEach((bike: any) => {
            bike.images.forEach((image: { key: string; }) => { 
                itemImageKeyArr.push({ 'Key': image.key });
            });
        })

        // delete item object from database
        const deletedItems = await itemCollection.deleteMany({user_id: currentUserId});
        if (deletedItems.deletedCount > 0){
            console.log(`User's ${ deletedItems.deletedCount } item(s) are deleted`);

            // delete files from aws s3
            const itemDeleteRequest: any = { 
                Bucket: process.env.S3_BUCKET_GOOSE_ITEMS, 
                Delete: {
                    Objects: itemImageKeyArr
                }
            };
            s3.deleteObjects(itemDeleteRequest, (err: AWSError, data: any) => {
                if (err) console.log(err, err.stack);  // error
                else     console.log();                 // deleted
            });
        }
        // =======================================



        // ========= delete user's profile =========
        const profileCollection = req.app.locals.db.collection('profiles');
        const profile = await profileCollection.findOne({user_id: currentUserId});
        const profileImageKey = profile.image.key

        // delete user object from database
        const deletedProfile = await profileCollection.deleteOne({user_id: currentUserId});
        if (deletedProfile.deletedCount > 0){
            console.log(`User's profile data is deleted`);
        }

        // delete files from aws s3
        if (profile.image.key){
            const profileDeleteRequest: any = { 
                Bucket: process.env.S3_BUCKET_GOOSE_PROFILES, 
                Delete: {
                    Objects: [{'Key': profileImageKey}]
                }
                
            };
            s3.deleteObjects(profileDeleteRequest, (err: AWSError, data: any) => {
                if (err) console.log(err, err.stack);  // error
                else     console.log();                 // deleted
            });
        }
        // =======================================



        // ============== delete user's bookmark data ==============
        const bookmarkCollection = req.app.locals.db.collection('bookmarks');

        // delete user object from database
        const deletedBookmark = await bookmarkCollection.deleteOne({user_id: currentUserId});
        if (deletedBookmark.deletedCount > 0){
            console.log(`User's bookmark data is deleted`);
        }
        // ========================================================

        // ============== delete bikes from others bookmark list ==============
        // this array will be used to delete users bikes from other users bookmark list
        const bikeIds = bikes.map( (bike: any) => bike._id.toString());
        const updateBookmarkDoc = {
            $pullAll: { bike_ids: bikeIds },
        };
        const updatedBookmarks = await bookmarkCollection.updateMany({}, updateBookmarkDoc);
        if ( updatedBookmarks.modifiedCount > 0){
            console.log(`${updatedBookmarks.modifiedCount} user's bookmark list(s) are updated`);
        }
        // ====================================================================



        // ============== delete user's following data ==============
        const followingCollection = req.app.locals.db.collection('following');

        // delete user object from database
        const deletedFollowing = await followingCollection.deleteOne({user_id: currentUserId});
        if (deletedFollowing.deletedCount > 0){
            console.log(`User's following data is deleted`);
        }
        // ===========================================================

        // ============= delete a user from others following list ==============
        // create a document that pulls the selected image
        const updateDoc = {
            $pull: { following_ids: currentUserId.toString() },
        };
        const result = await followingCollection.updateMany({}, updateDoc);
        if ( result.modifiedCount > 0){
            console.log(`${result.modifiedCount} user's following list(s) are updated`);
        }
        // ====================================================================
        


        /***** Delete MAIN database from user collection *****/
        const userCollection = req.app.locals.db.collection('users');
        const deletedUser = await userCollection.deleteOne({_id: ObjectID(currentUserId)});
        if (deletedUser.deletedCount > 0){
            console.log(`User is deleted`);
        }


        res.send({ 
            message: 'User is permanently deleted',
        });
    } catch(err) {
        res.json({ message: err });
    }
};

export default userDelete;