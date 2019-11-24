import express from 'express';
import passport from 'passport';
import request from 'request';
import TwitterTokenStrategy from 'passport-twitter-token';

import User from '../models/User';
import AuthController from '../Controllers/auth';

const router = express.Router();

passport.use(
  new TwitterTokenStrategy(
    {
      consumerKey: 'WsQCoFdIecg8dGe7MIM6q0Qfa',
      consumerSecret: '8t8Yt6T4XiOyD7RxRZ5BN9urIyJPE7EpludE3ToB4viGPzbE0I',
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
