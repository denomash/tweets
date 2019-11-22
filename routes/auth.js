import express from 'express';
import passport from 'passport';
import request from 'request';
import TwitterTokenStrategy from 'passport-twitter-token';

import User from '../models/User';

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

router.post('/twitter/reverse', (req, res) => {
  request.post(
    {
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http://127.0.0.1:3000/',
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET
      }
    },
    (err, r, body) => {
      if (err) {
        return res.send(500, { message: err.message });
      }

      var jsonStr =
        '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';

      res.send(JSON.parse(jsonStr));
    }
  );
});

router.post(
  '/twitter',
  (req, res, next) => {
    request.post(
      {
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: process.env.CONSUMER_KEY,
          consumer_secret: process.env.CONSUMER_SECRET,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      },
      (err, r, body) => {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        console.log('oauth_token', parsedBody.oauth_token);

        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        return next();
      }
    );
  },
  passport.authenticate('twitter-token', { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    const response = {
      id: req.user.id,
      token: req.body.oauth_token,
      user: req.user
    };

    res.status(200).json(response);
  }
);

export default router;
