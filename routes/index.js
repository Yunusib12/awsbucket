import express from 'express';
import awsAPI from './awsApi.js';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.sendFile('./index.html');
});

routes.use('/api', awsAPI);


export default routes;