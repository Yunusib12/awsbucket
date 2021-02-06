import AWS from 'aws-sdk';
import dotenv from 'dotenv';

//Initialize the Enviroment to reat .env file
dotenv.config({ silent: true });


//AWS Credential Config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
})

export default AWS;