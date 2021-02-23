import { Request, Response, NextFunction } from 'express';
import auth from 'basic-auth';
import bcryptjs from 'bcryptjs';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let message = null;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials){
        // Look for a user whose `email` matches the credentials `name`(email field is used for this app) property.
        const collection = req.app.locals.db.collection('users');
        const user = await collection.findOne({email: credentials.name});

        if (user){
            // bcryptjs.compareSync(): second argument hashes the user password to compare with already hashed password from db
            // return true if authenticated
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

            if (authenticated) {
                console.log(`Authentication successful for username: ${user.username}`);
        
                // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    
    if (message) {
        console.warn(message);
        // Return a response with a 401 Unauthorized HTTP status code.
        res.status(401).json({ message: 'Access Denied' });
    } else {
        // Or if user authentication succeeded... Call the next() method.
        next();
    }

};

export default authenticateUser;