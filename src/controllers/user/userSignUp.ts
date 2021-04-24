import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
const jwt = require('jsonwebtoken');
const generateAccessToken = require('./../../utils/generateAccessToken');
const sendEmail = require('./../../utils/sendEmail');


const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, username } = req.body;
        const userEmail = { email: email };
        const accessToken = await generateAccessToken(userEmail); // this token expires in 10 min
        const refreshToken = await jwt.sign(userEmail, process.env.REFRESH_TOKEN_SECRET);

        // get input field data from req.body and store in object
        const userObj: object = {
            email,
            name,
            username,
            password: bcryptjs.hashSync(req.body.password),
            token: {
                access: accessToken,
                refresh: refreshToken
            },
            status: 'pending'
        };

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.insertOne(userObj);
        console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);

        // profile
        const profileObj = {
            user_id: result.insertedId,
            username,
            bio: "",
            website: "",
            image: {
                key: "",
                location: ""
            }
        }

        // create associate profile database
        const profilesCollection = req.app.locals.db.collection('profiles');
        const profilesResult = await profilesCollection.insertOne(profileObj);
        console.log(`Associate profile object was inserted`);


        // ====== send email confirmation email ======
        const baseUrl = `${req.protocol}://${req.headers.host}`;
        const to = email;
        const from = 'motonx.dev@gmail.com';
        const subject = 'Goose app - Please verify your email address';
        const text = `
            <h3>Thank you for signning up!</h3><br />
            <p>Please verify your email address.<br />
            This verification expires in 10 minitue. You can re-send verification email if it's expired.</p><br />
            <p>This is your access token: ${ accessToken }</p><br />
            <a href="http://localhost:3000/verify/${ accessToken }">Verify my email address</a>
        `
        
        sendEmail(to, from, subject, text);
        // ===========================================

        
        return res.status(201).end();
    } catch(err) {
        res.json({ message: err });
    }
};

export default userSignUp;