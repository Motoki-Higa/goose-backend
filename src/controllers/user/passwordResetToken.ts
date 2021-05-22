import { Request, Response, NextFunction } from 'express';
const generateToken = require('./../../utils/generateToken');
const sendEmail = require('./../../utils/sendEmail');


const passwordResetToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const userEmail = { email: email };
        const token = await generateToken(userEmail, process.env.RESET_PW_TOKEN_SECRET); // this token expires in 10 min

        // below two variables are sent to updataOne() function
        const filter = { email: email };
        const updateDoc: object = { $set: { resetPasswordToken: token } };

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.insertedCount} documents were updated with the _id: ${result.insertedId}`);

        // ====== send email confirmation email ======
        const to = email;
        const from = 'motonx.dev@gmail.com';
        const subject = 'Goose app - Reset password';
        const text = `
            <h3>Reset password</h3>
            <p>This reset password link expires in 10 minitue. <br />
            You can request it again if it's expired.</p>
            <a href="${ process.env.SITE_URL }/password/reset/${ token }">Reset password from here</a>
        `
        
        sendEmail(to, from, subject, text);
        // ===========================================

        
        return res.status(201).end();
    } catch(err) {
        res.json({ message: err });
    }
};

export default passwordResetToken;