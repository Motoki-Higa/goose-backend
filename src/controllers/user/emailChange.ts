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
  
        const updateDoc = { $set: { email: newEmail } };

        // findOneAndUpdate() returns updated object *{returnOriginal: false} parameter is necessary
        let data = await collection.findOneAndUpdate(filter, updateDoc, { returnOriginal: false }); 

        console.log(`Email is now changed to ${ newEmail }`);

        const userObj = {
            _id: data.value._id,
            email: data.value.email,
            name: data.value.name,
            username: data.value.username,
        }

        res.send({ 
            message: `Email is now changed to ${ newEmail }`,
            user: userObj
        });

    } catch(err) {
        res.json({ message: err });
    }
};

export default emailChange;