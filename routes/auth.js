import express from 'express';
import passport from 'passport';
import TwitterTokenStrategy from 'passport-twitter-token';

import User from '../models/User';
import AuthController from '../Controllers/auth';
import * as twitterConfig from '../twitter.config';

const router = express.Router();

passport.use(
  new TwitterTokenStrategy(
    {
      consumerKey: twitterConfig.CONSUMER_KEY,
      consumerSecret: twitterConfig.CONSUMER_SECRET,
      includeEmail: true
    },
    (token, tokenSecret, profile, done) => {
      User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
        return done(err, user);
      });
    }
  )
);

router.post('/twitter/reverse', AuthController.requestToken);

router.post(
  '/twitter',
  AuthController.twitterAuthorisation,
  passport.authenticate('twitter-token', { session: false }),
  AuthController.returnUser
);

export default router;
