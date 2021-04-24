import { Request, Response, NextFunction } from 'express';

const userVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.accesstoken;
        const collection = await req.app.locals.db.collection('users');
        const filter = { "token.access": token };
        const user = await collection.findOne(filter);

        console.log(token)
        
        if (!user){
            res.status(404).send({ error: "Verification failed." });
        }
  
        const updateDoc = { $set: { status: 'verified' } };
        await collection.updateOne(filter, updateDoc);

        console.log(`${user.email} is verified now!`);

        res.send({ message: `${ user.email } is verified!`});
    } catch(err) {
        res.json({ message: err});
    }
};

export default userVerify;