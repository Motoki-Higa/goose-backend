export {}; // this fixes the bug of typescript says 'can not redeclare block-scoped variable 'jwt'
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

function emailVerifyTokenAuthenticate(req: Request, res: Response, next: NextFunction){
    const token = req.params.token;
    if (token == null){
        return res.status(404).send({ error: "Verification error" });
    }

    // as accessToken is set to expire in 10min, below checks if token is still valid or not
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err){
            return res.status(403).send({ error: "Verification failed" });
        }
        next();
    });
}

export default emailVerifyTokenAuthenticate;