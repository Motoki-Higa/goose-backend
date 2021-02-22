import { Request, Response, NextFunction, Router } from 'express';
var router = Router();
import bcryptjs from 'bcryptjs';

// import validators
import signUpValidator from '../middlewares/signUpValidator';

// import middlewares
// import authenticateUser from '../middleware/authenticateUser';

// This array is used to keep track of user records as they created for now. (will be replaced with DB later)
const users = [];

/* GET home page. */
router.get('/users', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection('comments');
    const limit = 20;
    const cursor = await collection.find().limit(limit);

    // check if database has data
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    // await cursor.forEach( item => console.log(item) );
    
    // If require all documents matched by a query to be held in memory at the same time, use toArray()
    cursor.toArray((queryError: any, results: any) => {
      res.json(results);
    })
  } catch(err) {
    res.json({ message: err });
  }
  // res.render('index', { title: 'Express' });
});

// Route that create a new user
router.post('/users', signUpValidator, (req: Request, res: Response, next: NextFunction) => {  
  const user = req.body;

  user.password = bcryptjs.hashSync(user.password);

  users.push(user);

  res.status(201).end();
});

export default router;
