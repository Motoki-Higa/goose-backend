import { Request, Response, NextFunction } from 'express';

const emailChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token;
        const newEmail = req.app.locals.newEmail;
        const collection = await req.app.locals.db.collection('users');
        const filter = { emailChangeToken: token };
        const user = await collection.findOne(filter);
        
        if (!user){
            res.status(404).send({ error: "User not found" });
        }

        const userObj = {
            _id: req.app.locals.currentUser._id,
            email: newEmail,
            name: req.app.locals.currentUser.name,
            username: req.app.locals.currentUser.username,
        }
  
        const updateDoc = { $set: { email: newEmail } };
        await collection.updateOne(filter, updateDoc)
        console.log(`Email is now changed to ${ newEmail }`);


        // ************ IMPORTANT ************
        // update req.app.locals.currentUser
        req.app.locals.currentUser.email = newEmail;
        // ***********************************

        
        res.send({ 
            message: `Email is now changed to ${ newEmail }`,
            user: userObj
        });

    } catch(err) {
        res.json({ message: err });
    }
};

export default emailChange;