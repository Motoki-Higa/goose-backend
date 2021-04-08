import { Request, Response, NextFunction, Router } from 'express';
var router = Router();
import { ObjectID } from 'mongodb';
import aws from 'aws-sdk';

// middlewares & validators
import signUpValidator from '../middlewares/userSignUp.validator';
import authenticateUser from '../middlewares/userSignIn.authenticate';
import bikeImageUpload from '../middlewares/bikeImageUpload';
import itemImageUpload from '../middlewares/itemImageUpload';
import profileImageUpload from '../middlewares/profileImageUpload';

// controllers
import userSignUp from '../controllers/userSignUp';
import userSignIn from '../controllers/userSignIn';

import feedAllBikes from '../controllers/feed/feedAllBikes';
import search from '../controllers/search';
import feedSingleBike from '../controllers/feed/feedSingleBike';

import postBike from '../controllers/bikes/postBike';
import deleteBike from '../controllers/bikes/deleteBike';
import updateSingleBike from '../controllers/bikes/updateSingleBike';
import deleteSingleBikeImage from '../controllers/bikes/deleteSingleBikeImage';
import getAllMyBikes from '../controllers/bikes/getAllMyBikes';
import getAllBikes from '../controllers/bikes/getAllBikes';
import getSingleBike from '../controllers/bikes/getSingleBike';

import postItem from '../controllers/items/postItem';
import deleteItem from '../controllers/items/deleteItem';
import updateSingleItem from '../controllers/items/updateSingleItem';
import deleteSingleItemImage from '../controllers/items/deleteSingleItemImage';
import getAllItems from '../controllers/items/getAllItems';
import getSingleItem from '../controllers/items/getSingleItem';

import postProfile from '../controllers/profiles/postProfile';
import getProfileById from '../controllers/profiles/getProfileById';
import getProfileByUsername from '../controllers/profiles/getProfileByUsername';



// Sign In : Route that returns the current authenticated user.
router.get('/users', authenticateUser, userSignIn);
// Sign Up : Route that create a new user
router.post('/users', signUpValidator, userSignUp);


// feed GET
router.get('/feed', feedAllBikes);
// feed/search POST
router.get('/feed/search', search('bikes'));
// feed/:id GET
router.get('/feed/:id', feedSingleBike);


// bikes POST
router.post('/bikes', bikeImageUpload.array('image', 5), postBike);
// bikes DELETE
router.delete('/bikes/:id', deleteBike);
// bikes/:id/edit POST (to update)
router.post('/bikes/:id/edit', bikeImageUpload.array('image', 5), updateSingleBike);
// bikes/:id/edit/image POST (to delete)
router.post('/bikes/:id/edit/image', deleteSingleBikeImage);
// bikes GET (My bikes *publicity true AND false)
router.get('/:userId/myBikes', getAllMyBikes);
// bikes GET (user's bikes *publicity true ONLY)
router.get('/:userId/bikes', getAllBikes);
// bike(single) GET
router.get('/:userId/bikes/:id', getSingleBike);


// items POST
router.post('/items', itemImageUpload.array('image', 5), postItem);
// items/:id DELETE
router.delete('/items/:id', deleteItem);
// items/:id/edit POST (to update)
router.post('/items/:id/edit', itemImageUpload.array('image', 5), updateSingleItem);
// items/:id/edit/image POST (to delete)
router.post('/items/:id/edit/image', deleteSingleItemImage);
// items GET
router.get('/:userId/items', getAllItems);
// item(single) GET
router.get('/:userId/items/:id', getSingleItem);


// profile GET (this route is used for finding a user through items such as bike or item)
router.get('/:userId/profile', getProfileById);
// profile POST
router.post('/profile', profileImageUpload.array('image', 1), postProfile);
// profile GET
router.get('/profile/:username', getProfileByUsername);



export default router;
