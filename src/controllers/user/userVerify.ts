import { Request, Response, NextFunction } from 'express';

const userVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token;
        const collection = await req.app.locals.db.collection('users');
        const filter = { verificationToken: token };
        const user = await collection.findOne(filter);
        
        if (!user){
            res.status(404).send({ error: "Verification failed" });
        }
  
        const updateDoc = { $set: { status: 'verified' } };
        await collection.updateOne(filter, updateDoc);

        console.log(`${user.email} is now verified`);

        res.send({ message: `${ user.email } is now verified`});
    } catch(err) {
        res.json({ message: err});
    }
};

export default userVerify;