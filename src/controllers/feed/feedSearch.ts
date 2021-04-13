import { Request, Response, NextFunction } from 'express';

const feedSearch = (collectionName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const search = req.query.q;
            const collection = await req.app.locals.db.collection(collectionName);
            // collection.dropIndex() <- use this before collection.createIndex to reset first
            collection.createIndex({ name: "text", brand: "text" });
            const query = { 
                public: "true",
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

export default feedSearch;