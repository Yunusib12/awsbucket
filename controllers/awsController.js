import AWS from 'aws-sdk';
import uuid from 'uuid4';
import dotenv from 'dotenv'
dotenv.config()

//Get the credentials
const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });

AWS.config.credentials = credentials;

//Constructs a service object.
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const awsController = {
    allbucket: (req, res) => {

        const bucketList = s3.listBuckets().promise();

        bucketList.then((data) => {
            res.send(data);
        }).catch((err) => console.log(err));
    },
    listAllBucketObject: (req, res) => {

        const bucketName = req.params.name;
        const params = {
            Bucket: bucketName
        };

        const response = s3.listObjectsV2(params).promise();

        response.then((data) => {
            res.send(data);
        }).catch((err) => console.log(err));

    },
    createBucket: (req, res) => {

        //Create a unique Bucket Name
        const receiveBucketName = req.body.bucketName;
        const bucketName = `${receiveBucketName.toLowerCase()}-${uuid()}`

        //Create the Bucket 
        const params = {
            Bucket: bucketName
        };

        const response = s3.createBucket(params).promise();

        response.then((data) => {
            res.send({ msg: "Bucket Successfully created", data: data })
        }).catch((err) => console.error(err));
    },
    deleteBucket: (req, res) => {

        const bucketToDelete = req.params.name;
        const params = {
            Bucket: bucketToDelete
        }

        const bDelete = s3.deleteBucket(params).promise();

        bDelete.then(() => {
            res.send(true);

        }).catch((err) => {
            console.log(err, err.stack);
            res.send(err);
        });
    },
    uploadFile: (req, res) => {

        try {
            const fileName = `${uuid()}-${req.file.originalname}`;
            const data = req.file.buffer;
            const bucketName = req.params.name;
            const fileUploadParams = {
                params: {
                    Bucket: bucketName,
                    Key: fileName,
                    Body: data,
                    ACL: "public-read"
                }
            };

            const fileUpload = s3.upload(fileUploadParams.params).promise();

            fileUpload.then((response) => {

                res.send(response);
            })
        } catch (error) {
            console.log(error);
        }
    },
    deleteBucketObject: (req, res) => {

        try {
            const bucketName = req.params.name;
            const objectKey = req.params.object;

            const objectDeleteParams = {
                Bucket: bucketName,
                Key: objectKey
            };

            const deleteObject = s3.deleteObject(objectDeleteParams).promise();

            deleteObject.then((results) => {
                res.send(results);
            })
        } catch (error) {
            console.log(error);
            res.send(error);
        }

    }
};

export default awsController;


