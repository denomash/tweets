import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import auth from './routes/auth';
import twitterActions from './routes/twitterActions';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
// Allow cross origin
app.use(cors());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to the database

const uri = process.env.DATABASE_URL;

mongoose.connect(uri, { useNewUrlParser: true }, () =>
  console.log('Connected to the database')
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use('/auth', auth);
app.use('/', twitterActions);

app.listen(PORT, () => console.log(`Running on localhost:${PORT}`));
