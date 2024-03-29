import { Request, Response, NextFunction } from 'express';
import aws from 'aws-sdk';
import multer from 'multer'; // middleware for handling multipart/form-data
import sharp from 'sharp'; // convert large images
import path from 'path';
const multerS3 = require ('multer-s3-transform'); // Streaming multer storage engine for AWS S3


const imageUploadProfile = (req: Request, res: Response, next: NextFunction) => {
    // S3 configuration
    const s3Config = new aws.S3({
        secretAccessKey: process.env.S3_ACCESS_SECRET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        region: "ap-northeast-1",
    });

    const fileFilter = (req: any, file: any, cb: any) => {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|webp/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true); // true = store image
        } else {
            cb(new Error("Invalid file type, only JPEG, PNG and WEBP are allowed"), false);
        }
    };

    // Create a multer storage config object with multer-s3
    const multerS3Config = multerS3({
        s3: s3Config,
        bucket: `${process.env.S3_BUCKET_GOOSE_PROFILES}`, // with object literal, you can prevent typescript error
        // metadata for putting field name
        metadata: function (req: any, file: any, cb: any) {
            cb(null, { fieldName: file.fieldname });
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [{
            id: 'original',
            key: function (req: any, file: any, cb: any) {
                cb(null, Date.now().toString() + file.originalname);
            },
            transform: function (req: any, file: any, cb: any) {
                cb(null, sharp().rotate().resize(200))
            }
        }]
    });

    // Create multer function for upload
    const upload = multer({
        storage: multerS3Config,
        fileFilter: fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 10 // we are allowing only 5 MB files
        }
    }).single('image')

    upload(req,res, function(err: any){
        if(err){
            res.status(400).json({error: err.message});
        } else {
            next();
        }
    })
}
    

export default imageUploadProfile;