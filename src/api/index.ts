import { Request, Response, NextFunction, Router } from 'express';
var router = Router();
import { ObjectID } from 'mongodb';
import aws from 'aws-sdk';

// middlewares & validators
import signUpValidator from '../middlewares/signUpValidator';
import authenticateUser from '../middlewares/authenticateUser';
import upload from '../middlewares/imageUpload';

// services
import userSignUp from '../controllers/userSignUp';
import userSignIn from '../controllers/userSignIn';

// This array is used to keep track of user records as they created for now. (will be replaced with DB later)
const users = [];

/* GET home page. */
// router.get('/users', async (req, res, next) => {
//     try {
//         const collection = req.app.locals.db.collection('users');
//         const limit = 20;
//         const cursor = await collection.find({email: "mokkyhiga@gmail.com"}).limit(limit);

//         // check if database has data
//         if ((await cursor.count()) === 0) {
//             console.log("No documents found!");
//         }

//         // If require all documents matched by a query to be held in memory at the same time, use toArray()
//         cursor.toArray((queryError: string, results: string) => {
//             res.json(results);
//         })
//     } catch(err) {
//         res.json({ message: err });
//     }
// });

// Sign In : Route that returns the current authenticated user.
router.get('/users', authenticateUser, userSignIn);

// Sign Up : Route that create a new user
router.post('/users', signUpValidator, userSignUp);

// mybike POST
router.post('/mybikes', upload.array('image', 10), async ( req, res, next) => {
    try {
        // 1. get info of images which are stored in aws s3
        // 2. get only 'key' and 'location' from each file object
        // * (images as any) solves the issue of gettting 'expression is not callable' on map()
        const images = req.files;
        const imagesData = (images as any).map( (image: any) => {
            return {'key': image.key, 'location': image.location};
        })

        const bikeObj = {
            user_id: req.app.locals.currentUser._id,
            name: req.body.name,
            brand: req.body.brand,
            builtby: req.body.builtby,
            desc: req.body.desc,
            images: imagesData
        }

        // store values in db
        const collection = req.app.locals.db.collection('bikes');
        const result = await collection.insertOne(bikeObj);
        console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
        
    } catch(err) {
        console.log(err)
    }
})

export default router;
