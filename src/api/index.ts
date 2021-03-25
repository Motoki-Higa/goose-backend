import { Request, Response, NextFunction, Router } from 'express';
var router = Router();
import { ObjectID } from 'mongodb';
import aws from 'aws-sdk';

// middlewares & validators
import signUpValidator from '../middlewares/userSignUp.validator';
import authenticateUser from '../middlewares/userSignIn.authenticate';
import bikeImageUpload from '../middlewares/bikeImageUpload';
import itemImageUpload from '../middlewares/itemImageUpload';

// controllers
import userSignUp from '../controllers/userSignUp';
import userSignIn from '../controllers/userSignIn';

import feed from '../controllers/feed';

import postBike from '../controllers/myBikes/postBike';
import getAllMyBikes from '../controllers/myBikes/getAllMyBikes';
import getMyBike from '../controllers/myBikes/getMyBike';
import deleteMyBike from '../controllers/myBikes/deleteMyBike';
import updateSingleBike from '../controllers/myBikes/updateSingleBike';
import deleteSingleBikeImage from '../controllers/myBikes/deleteSingleBikeImage';

import postItem from '../controllers/myItems/postItem';
import getAllMyItems from '../controllers/myItems/getAllMyItems';
import getMyItem from '../controllers/myItems/getMyItem';
import deleteMyItem from '../controllers/myItems/deleteMyItem';
import updateSingleItem from '../controllers/myItems/updateSingleItem';
import deleteSingleItemImage from '../controllers/myItems/deleteSingleItemImage';

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


// Feed
router.get('/feed', feed);


// mybikes GET
router.get('/mybikes', getAllMyBikes);
// mybikes POST
router.post('/mybikes', bikeImageUpload.array('image', 5), postBike);
// mybikes/:id GET
router.get('/mybikes/:id', getMyBike)
// mybikes/:id DELETE
router.delete('/mybikes/:id', deleteMyBike)
// mybikes/:id/edit POST (to update)
router.post('/mybikes/:id/edit', bikeImageUpload.array('image', 5), updateSingleBike)
// mybikes/:id/edit/image POST (to delete)
router.post('/mybikes/:id/edit/image', deleteSingleBikeImage)


// myitems GET
router.get('/myitems', getAllMyItems);
// myitems POST
router.post('/myitems', itemImageUpload.array('image', 5), postItem);
// myitems/:id GET
router.get('/myitems/:id', getMyItem)
// myitems/:id DELETE
router.delete('/myitems/:id', deleteMyItem)
// myitems/:id/edit POST (to update)
router.post('/myitems/:id/edit', itemImageUpload.array('image', 5), updateSingleItem)
// myitems/:id/edit/image POST (to delete)
router.post('/mybikes/:id/edit/image', deleteSingleItemImage)


export default router;
