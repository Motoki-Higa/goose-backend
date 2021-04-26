import { Router } from 'express';
var router = Router();

// middlewares & validators
import signUpValidator from '../middlewares/userSignUp.validator';
import authenticateVerificationToken from '../middlewares/authenticateVerificationToken';
import authenticateResetPwToken from '../middlewares/authenticateResetPwToken';
import verificationTokenValidator from '../middlewares/verificationToken.validator';
import authenticateUser from '../middlewares/userSignIn.authenticate';
import resetPwValidator from '../middlewares/resetPw.validator';
import userEditValidator from '../middlewares/userEdit.validator';
import bikeImageUpload from '../middlewares/bikeImageUpload';
import itemImageUpload from '../middlewares/itemImageUpload';
import profileImageUpload from '../middlewares/profileImageUpload';

// controllers
import userSignUp from '../controllers/user/userSignUp';
import userVerify from '../controllers/user/userVerify';
import issueVerificationToken from '../controllers/user/issueVerificationToken';
import issueResetPwToken from '../controllers/user/issueResetPwToken';
import userSignIn from '../controllers/user/userSignIn';
import userUpdate from '../controllers/user/userUpdate';
import userDelete from '../controllers/user/userDelete';
import changePw from '../controllers/user/changePw';
import resetPw from '../controllers/user/resetPw';

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


// Sign Up 
router.post('/users', signUpValidator, userSignUp);
// Re-send token : used when verification link is expired
router.post('/users/verificationToken', verificationTokenValidator, issueVerificationToken);
// Verify email
router.get('/users/verify/:token', authenticateVerificationToken, userVerify);

// Sign In : Route that returns the current authenticated user.
router.get('/users', authenticateUser, userSignIn);

// Request reset pw token
router.put('/users/reset-password', resetPwValidator, issueResetPwToken);
// Reset pw
router.put('/reset-password/:token', authenticateResetPwToken, resetPw)


// account PUT (to edit)
router.put('/users/:id', userEditValidator, userUpdate);
// account DELETE
router.delete('/users/:id', authenticateUser, userDelete);
// password PUT (to change)
router.put('/users/:id/password/change', authenticateUser, changePw);


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
// bikes/search GET
router.get('/:userId/myBikes/search', bikesSearch('bikes'));
// bikes/search GET
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
// items/search GET
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
