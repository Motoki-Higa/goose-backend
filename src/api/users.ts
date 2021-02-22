import { Request, Response, NextFunction, Router } from 'express';
var router = Router();
import bcryptjs from 'bcryptjs';

// import validators
import signUpValidator from '../validators/signUpValidator';

// import middlewares
// import authenticateUser from '../middleware/authenticateUser';

// This array is used to keep track of user records as they created for now. (will be replaced with DB later)
const users = [];

/* GET home page. */
router.get('/users', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Route that create a new user
router.post('/users', signUpValidator, (req: Request, res: Response, next: NextFunction) => {  
  const user = req.body;

  user.password = bcryptjs.hashSync(user.password);

  users.push(user);

  res.status(201).end();
});

export default router;
