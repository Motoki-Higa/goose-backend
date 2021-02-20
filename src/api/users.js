var express = require('express');
var router = express.Router();

// import validators
const signUpValidator = require('./../validators/signUpValidator');

// This array is used to keep track of user records as they created for now. (will be replaced with DB later)
const users = [];

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// Route that create a new user
router.post('/', signUpValidator, (req, res, next) => {  
  const user = req.body;

  users.push(user);

  res.status(201).end();
});

module.exports = router;
