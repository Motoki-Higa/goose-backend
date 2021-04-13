import { Request, Response, NextFunction } from 'express';
const { ObjectID } = require('mongodb');

const itemsSearch = (collectionName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId;
            const search = req.query.q;
            const collection = await req.app.locals.db.collection(collectionName);
            // collection.dropIndex() // <- use this before collection.createIndex to reset first
            collection.createIndex({ name: "text", brand: "text" });
            const query = { 
                user_id: ObjectID(userId),
                $text: { $search: search } 
            };

            const cursor = await collection.find(query);
        
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            
            cursor.toArray((queryError: string, results: string) => {
                res.json(results);
            })
        } catch(err) {
            console.log(err);
        }
    }
}

export default itemsSearch;