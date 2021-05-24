import { Router } from 'express';
var router = Router();

// middlewares & validators
import signUpValidator from '../middlewares/userSignUp.validator';
import emailVerifyTokenValidator from '../middlewares/emailVerifyToken.validator';
import emailVerifyTokenAuthenticate from '../middlewares/emailVerifyToken.authenticate';
import authenticateUser from '../middlewares/userSignIn.authenticate';
import passwordResetValidator from '../middlewares/passwordReset.validator';
import passwordResetTokenAuthenticate from '../middlewares/passwordResetToken.authenticate';
import userEditValidator from '../middlewares/userEdit.validator';
import emailChangeTokenValidator from '../middlewares/emailChangeToken.validator';
import emailChangeTokenAuthenticate from '../middlewares/emailChangeToken.authenticate';
import imageUploadBike from '../middlewares/imageUpload.bike';
import imageUploadItem from '../middlewares/imageUpload.item';
import imageUploadProfile from '../middlewares/imageUpload.profile';

// controllers
import userSignUp from '../controllers/user/userSignUp';
import emailVerify from '../controllers/user/emailVerify';
import emailVerifyToken from '../controllers/user/emailVerifyToken';
import userSignIn from '../controllers/user/userSignIn';
import userUpdate from '../controllers/user/userUpdate';
import userDelete from '../controllers/user/userDelete';
import passwordChange from '../controllers/user/passwordChange';
import passwordResetToken from '../controllers/user/passwordResetToken';
import passwordReset from '../controllers/user/passwordReset';
import emailChangeToken from '../controllers/user/emailChangeToken';
import emailChange from '../controllers/user/emailChange';

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

import postParts from '../controllers/parts/postParts';
import editParts from '../controllers/parts/editParts';
import deleteParts from '../controllers/parts/deleteParts';

import postItem from '../controllers/items/postItem';
import deleteItem from '../controllers/items/deleteItem';
import updateSingleItem from '../controllers/items/updateSingleItem';
import deleteSingleItemImage from '../controllers/items/deleteSingleItemImage';
import getAllItems from '../controllers/items/getAllItems';
import itemsSearch from '../controllers/items/itemsSearch';
import getSingleItem from '../controllers/items/getSingleItem';

import getBookmark from '../controllers/bookmarks/getBookmark';
import getSavedBikes from '../controllers/bookmarks/getSavedBikes';
import bookmarkSearch from '../controllers/bookmarks/bookmarkSearch';
import saveToBookmark from '../controllers/bookmarks/saveToBookmark';
import removeFromBookmark from '../controllers/bookmarks/removeFromBookmark';

import getFollowing from '../controllers/following/getFollowing';
import getAllFollowingUsers from '../controllers/following/getAllFollowingUsers';
import follow from '../controllers/following/follow';
import unFollow from '../controllers/following/unFollow';

import getProfileById from '../controllers/profiles/getProfileById';
import getProfileByUsername from '../controllers/profiles/getProfileByUsername';
import updateProfile from '../controllers/profiles/updateProfile';
import deleteProfileImage from '../controllers/profiles/deleteProfileImage';


// Sign Up 
router.post('/users', signUpValidator, userSignUp);
// Sign In : Route that returns the current authenticated user.
router.get('/users', authenticateUser, userSignIn);
// Email verify request : used when verification link is expired
router.put('/users/email/verify/request', emailVerifyTokenValidator, emailVerifyToken);
// Email verify
router.get('/users/email/verify/:token', emailVerifyTokenAuthenticate, emailVerify);
// Password reset request
router.put('/users/password/reset/request', passwordResetValidator, passwordResetToken);
// Password reset
router.put('/users/password/reset/:token', passwordResetTokenAuthenticate, passwordReset)


// account PUT (to edit)
router.put('/users/:username', userEditValidator, userUpdate);
// account DELETE
router.delete('/users/:id', authenticateUser, userDelete);
// Email change request
router.put('/users/:id/email/change/request', emailChangeTokenValidator, emailChangeToken);
// Email change
router.put('/users/:id/email/change/:token', emailChangeTokenAuthenticate, emailChange);
// password PUT (to change)
router.put('/users/:id/password/change', authenticateUser, passwordChange);


// feed GET
router.get('/feed', feedAllBikes);
// feed/search POST
router.get('/feed/search', feedSearch('bikes'));
// feed/:id GET
router.get('/feed/:id', feedSingleBike);


// bikes POST
router.post('/:userId/bikes', imageUploadBike, postBike);
// bikes DELETE
router.delete('/bikes/:id', deleteBike);
// bikes/:id/edit POST (to update)
router.post('/bikes/:id/edit', imageUploadBike, updateSingleBike);
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


// bike parts POST
router.post('/bikes/:id/parts', postParts);
// bike parts PUT (edit)
router.put('/bikes/:id/parts', editParts);
// bike parts DELETE
router.delete('/bikes/:id/parts', deleteParts);


// items POST
router.post('/:userId/items', imageUploadItem, postItem);
// items/:id DELETE
router.delete('/items/:id', deleteItem);
// items/:id/edit POST (to update)
router.post('/items/:id/edit', imageUploadItem, updateSingleItem);
// items/:id/edit/image POST (to delete)
router.post('/items/:id/edit/image', deleteSingleItemImage);
// items GET
router.get('/:userId/items', getAllItems);
// items/search GET
router.get('/:userId/items/search', itemsSearch('items'));
// item(single) GET
router.get('/:userId/items/:id', getSingleItem);


// save to bookmark POST
router.post('/:userId/bookmark/bikes/:id', saveToBookmark);
// remove from bookmark DELETE
router.delete('/:userId/bookmark/bikes/:id', removeFromBookmark);
// get bookmarks by user_id
router.get('/:userId/bookmark', getBookmark);
// get all bookmark(bikes)
router.post('/:userId/bookmark/bikes', getSavedBikes);
// search bookmark(bikes)
router.post('/:userId/bookmark/bikes/search', bookmarkSearch('bikes'));


// get all bookmark(bikes)
router.post('/following', getAllFollowingUsers);
// get all following users
router.get('/:userId/following', getFollowing);
// follow
router.post('/:userId/following/:id', follow);
// unfollow
router.delete('/:userId/following/:id', unFollow);


// profile POST
// * initial profile post is automatically done on sign up
// profile GET
router.get('/profile/:username', getProfileByUsername);
// profile GET (this route is used for finding a user through items such as bike or item)
router.get('/profile/userId/:userId', getProfileById);
// profile update POST 
router.post('/profile/:id/edit', imageUploadProfile, updateProfile);
// profile image DELETE (to delete)
router.delete('/profile/:userId/image/:imageKey', deleteProfileImage);



export default router;
