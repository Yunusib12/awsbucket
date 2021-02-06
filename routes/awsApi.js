import express from 'express';
import awsController from '../controllers/awsController.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const routes = express.Router();
const upload = multer({ storage: storage });


//List All the bucket
routes
    .route('/buckets')
    .get(awsController.allbucket);


//List All Bucket Object
routes
    .route('/bucketobject/:name')
    .get(awsController.listAllBucketObject);

//Create Bucket 
routes
    .route('/addbucket')
    .post(awsController.createBucket);

//Delete Bucket
routes
    .route('/deletebucket/:name')
    .delete(awsController.deleteBucket);

//Delete Bucket Object
routes
    .route('/deleteobject/:name/:object')
    .delete(awsController.deleteBucketObject);

//Upload File
routes
    .post("/upload/:name", upload.single('fileUpload'), awsController.uploadFile);


export default routes;