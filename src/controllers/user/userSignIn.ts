import { Request, Response, NextFunction } from 'express';

const userSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.currentUser;
  
        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
        });
    } catch(err) {
        res.json({ message: err});
    }
};

export default userSignIn;