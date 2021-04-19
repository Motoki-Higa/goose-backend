import { Router } from 'express';
var router = Router();

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
import feedSearch from '../controllers/feed/feedSearch';
import feedSingleBike from '../controllers/feed/feedSingleBike';

import postBike from '../controllers/bikes/postBike';
import deleteBike from '../controllers/bikes/deleteBike';
import updateSingleBike from '../controllers/bikes/updateSingleBike';
import deleteSingleBikeImage from '../controllers/bikes/deleteSingleBikeImage';
import getAllMyBikes from '../controllers/bikes/getAllMyBikes';
import getAllBikes from '../controllers/bikes/getAllBikes';
import bikesSearch from '../controllers/bikes/bikesSearch';
import getSingleBike from '../controllers/bikes/getSingleBike';

import postItem from '../controllers/items/postItem';
import deleteItem from '../controllers/items/deleteItem';
import updateSingleItem from '../controllers/items/updateSingleItem';
import deleteSingleItemImage from '../controllers/items/deleteSingleItemImage';
import getAllItems from '../controllers/items/getAllItems';
import itemsSearch from '../controllers/items/itemsSearch';
import getSingleItem from '../controllers/items/getSingleItem';

import getProfileById from '../controllers/profiles/getProfileById';
import getProfileByUsername from '../controllers/profiles/getProfileByUsername';
import updateProfile from '../controllers/profiles/updateProfile';
import deleteProfileImage from '../controllers/profiles/deleteProfileImage';

import getBookmark from '../controllers/bookmarks/getBookmark';
import getSavedBikes from '../controllers/bookmarks/getSavedBikes';
import bookmarkSearch from '../controllers/bookmarks/bookmarkSearch';
import saveToBookmark from '../controllers/bookmarks/saveToBookmark';
import removeFromBookmark from '../controllers/bookmarks/removeFromBookmark';



// Sign In : Route that returns the current authenticated user.
router.get('/users', authenticateUser, userSignIn);
// Sign Up : Route that create a new user
router.post('/users', signUpValidator, userSignUp);


// feed GET
router.get('/feed', feedAllBikes);
// feed/search POST
router.get('/feed/search', feedSearch('bikes'));
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
// bikes/search POST
router.get('/:userId/myBikes/search', bikesSearch('bikes'));
// bikes/search POST
router.get('/:userId/bikes/search', bikesSearch('bikes'));
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
// items/search POST
router.get('/:userId/items/search', itemsSearch('items'));
// item(single) GET
router.get('/:userId/items/:id', getSingleItem);


// save to bookmark POST
router.post('/bookmark/bikes/:id', saveToBookmark);
// remove from bookmark DELETE
router.delete('/bookmark/bikes/:id', removeFromBookmark);
// get bookmarks by user_id
router.get('/:userId/bookmark', getBookmark);
// get all bookmark(bikes)
router.post('/:userId/bookmark/bikes', getSavedBikes);
// get all bookmark(bikes)
router.post('/:userId/bookmark/bikes/search', bookmarkSearch('bikes'));


// profile POST
// * initial profile post is automatically done on sign up
// profile GET
router.get('/profile/:username', getProfileByUsername);
// profile GET (this route is used for finding a user through items such as bike or item)
router.get('/profile/userId/:userId', getProfileById);
// profile update POST 
router.post('/profile/:id/edit', profileImageUpload.single('image'), updateProfile);
// profile image POST (to delete)
router.delete('/profile/:userId/image/:imageKey', deleteProfileImage);



export default router;
