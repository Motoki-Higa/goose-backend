import { Request, Response, NextFunction, Router } from 'express';
var router = Router();
import { ObjectID } from 'mongodb';
import aws from 'aws-sdk';

// middlewares & validators
import signUpValidator from '../middlewares/userSignUp.validator';
import authenticateUser from '../middlewares/userSignIn.authenticate';
import upload from '../middlewares/imageUpload';

// controllers
import userSignUp from '../controllers/userSignUp';
import userSignIn from '../controllers/userSignIn';
import postBike from '../controllers/postBike';
import getAllMyBikes from '../controllers/getAllMyBikes';
import getMyBike from '../controllers/getMyBike';
import deleteMyBike from '../controllers/deleteMyBike';
import updateSingleBike from '../controllers/updateSingleBike';
import deleteSingleBikeImage from '../controllers/deleteSingleBikeImage';

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

// mybikes GET
router.get('/mybikes', getAllMyBikes);

// mybikes POST
router.post('/mybikes', upload.array('image', 10), postBike);

// mybikes/:id GET
router.get('/mybikes/:id', getMyBike)

// mybikes/:id DELETE
router.delete('/mybikes/:id', deleteMyBike)

// mybikes/:id/edit POST (to update)
router.post('/mybikes/:id/edit', upload.array('image', 10), updateSingleBike)

// mybikes/:id/edit/image POST (to delete)
router.post('/mybikes/:id/edit/image', deleteSingleBikeImage)


export default router;
