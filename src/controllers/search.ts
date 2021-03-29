import { Request, Response, NextFunction } from 'express';

const search = (collectionName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const search = req.query.q;
            const collection = req.app.locals.db.collection(collectionName);
            collection.createIndex({ name: "text" });
            const query = { 
                public: "true",
                $text: { $search: search } 
            };
    
            // filter what field of each matched document. 0 = not return, 1 = return
            // read mongoDB drivers documentation for more details
            const projection = {
                _id: 1,
                user_id: 1,
                brand: 1,
                name: 1,
                desc: 1,
                images: 1,
                public: 1,
                builtby: 1
            };
    
            const cursor = await collection.find(query).project(projection);
        
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

export default search;