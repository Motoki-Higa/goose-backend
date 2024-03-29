import { Request, Response, NextFunction } from 'express';
const generateToken = require('./../../utils/generateToken');
const sendEmail = require('./../../utils/sendEmail');


const emailVerifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const userEmail = { email: email };
        const token = await generateToken(userEmail, process.env.ACCESS_TOKEN_SECRET); // this token expires in 10 min

        // below two variables are sent to updataOne() function
        const filter = { email: email };
        const updateDoc: object = { $set: { verificationToken: token } };

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.insertedCount} documents were updated with the _id: ${result.insertedId}`);

        // ====== send email confirmation email ======
        const to = email;
        const from = 'motonx.dev@gmail.com';
        const subject = 'Goose app - Please verify your email address';
        const text = `
            <h3>Thank you for signning up!</h3>
            <p>Please verify your email address.<br />
            Below verification link will expire in 10 minitue. <br />
            You can re-send verification email if it's expired.</p>
            <a href="${ process.env.SITE_URL }/email/verify/${ token }">Verify my email address</a>
        `
        
        sendEmail(to, from, subject, text);
        // ===========================================

        
        return res.status(201).end();
    } catch(err) {
        res.json({ message: err });
    }
};

export default emailVerifyToken;