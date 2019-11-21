import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy } from 'passport-twitter';
import session from 'express-session';
import mongoose from 'mongoose';

import auth from './routes/auth';

const PORT = 8080 || process.env.PORT;

const app = express();

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
mongoose.connect(
  'mongodb://localhost/tweetEdu',
  { useNewUrlParser: true },
  () => console.log('Connected to the database')
);

app.use('/auth', auth);

app.listen(PORT, () => console.log(`Running on localhost:${PORT}`));
