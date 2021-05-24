import { Request, Response, NextFunction } from 'express';
const generateToken = require('./../../utils/generateToken');
const sendEmail = require('./../../utils/sendEmail');


const emailChangeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldEmail, newEmail } = req.body;
        const newEmailObj = { email: newEmail };
        const userEmail = oldEmail;
        const token = await generateToken(newEmailObj, process.env.EMAIL_CHANGE_TOKEN_SECRET); // this token expires in 10 min

        // below two variables are sent to updataOne() function
        const filter = { email: userEmail };
        const updateDoc: object = { $set: { emailChangeToken: token } };

        // store values in database (users)
        const collection = req.app.locals.db.collection('users');
        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.insertedCount} documents were updated with the _id: ${result.insertedId}`);


        // ====== send email change request notification to current email ======
        const to = userEmail;
        const from = 'motonx.dev@gmail.com';
        const subject = 'Goose app - Confirm your email address change';
        const text = `
            <h3>A request has been received to change your email address for your Goose account.</h3>
            <p>New email address: ${ newEmail }</p>
        `
        
        sendEmail(to, from, subject, text);
        // =================================================================


        // ====== send email change request confirmation to the new email ======
        const to_02 = newEmail;
        const from_02 = 'motonx.dev@gmail.com';
        const subject_02 = 'Goose app - Confirm your email address change';
        const text_02 = `
            <h3>A request has been received to change your email address for your Goose account.</h3>
            <p>New email address: ${ newEmail }</p>
            <p>The link below is valid for 10 minitue. <br />
            Please request it again if it's expired.</p>
            <a href="${ process.env.SITE_URL }/email/change/${ token }">Verify new email</a>
        `
        
        sendEmail(to_02, from_02, subject_02, text_02);
        // ====================================================================

        
        return res.status(201).send({
            message: 'Confirmation email is sent'
        });
    } catch(err) {
        res.json({ message: err });
    }
};

export default emailChangeToken;