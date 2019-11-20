import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const PORT = 8080 || process.env.PORT;

app.use(morgan('dev'));

// Allow cross origin
app.use(cors());

app.listen(PORT, () => console.log(`Running on localhost:${PORT}`));
