import { Request, Response, NextFunction } from 'express';
import auth from 'basic-auth';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available...
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).

    // If a user was successfully retrieved from the data store...
    // Use the bcryptjs npm package to compare the user's password
    // (from the Authorization header) to the user's password
    // that was retrieved from the data store.

    // If the passwords match...
    // Then store the retrieved user object on the request object
    // so any middleware functions that follow this middleware function
    // will have access to the user's information.

    // If user authentication failed...
    // Return a response with a 401 Unauthorized HTTP status code.

    // Or if user authentication succeeded...
    // Call the next() method.
}