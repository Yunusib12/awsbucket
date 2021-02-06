
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

//Parsing the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Set Static folder
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "./public")));

//Cors
app.use(cors());

//Routes
app.use(routes);

app.listen(PORT, () => console.log(`The Server is listening on port ${PORT}`));
