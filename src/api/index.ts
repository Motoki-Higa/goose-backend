import { Request, Response, NextFunction, Router } from 'express';
var router = Router();

// validators
import signUpValidator from '../middlewares/signUpValidator';

// middlewares
import authenticateUser from '../middlewares/authenticateUser';

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

export default router;
