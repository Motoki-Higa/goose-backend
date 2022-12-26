import { Request, Response, NextFunction } from 'express';
import auth from 'basic-auth';
import bcryptjs from 'bcryptjs';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    let error = null;

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

                if (user.status === 'verified'){

                    // Store the user on the Request object.
                    req.currentUser = user;
                    console.log(`Authentication successful for email: ${user.email}`);

                } else {
                    error = `${user.email} is not verified yet`
                }
            } else {
                error = `Authentication failure for email: ${user.email}`;
            }
        } else {
            error = `User not found for email: ${credentials.name}`;
        }
    } else {
        error = 'Auth header not found';
    }
    
    if (error) {
        console.warn(error);
        // Return a response with a 401 Unauthorized HTTP status code.
        // res.status(401).json({ message: message });
        return res.status(401).json({ error: error });
    } else {
        // Or if user authentication succeeded... Call the next() method.
        next();
    }

};

export default authenticateUser;