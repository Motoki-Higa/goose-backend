import aws from 'aws-sdk';
import multer from 'multer'; // middleware for handling multipart/form-data
import multerS3 from 'multer-s3'; // Streaming multer storage engine for AWS S3

// S3 configuration
const s3Config = new aws.S3({
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: "ap-northeast-1",
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true); // true = store image
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

// Create a multer storage config object with multer-s3
const multerS3Config = multerS3({
    s3: s3Config,
    bucket: `${process.env.S3_BUCKET}`, // with object literal, you can prevent typescript error
    // metadata for putting field name
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    // Set/Modify original file name
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
    },
    // without defining contentType like below, the image gets downloaded instead of displaying when you access url
    contentType: multerS3.AUTO_CONTENT_TYPE,
});

// Create multer function for upload
const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})

export default upload;