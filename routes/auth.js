import express from 'express';
import passport from 'passport';
import request from 'request';
import jwt from 'jsonwebtoken';
import TwitterTokenStrategy from 'passport-twitter-token';

import User from '../models/User';

const router = express.Router();

passport.use(
  new TwitterTokenStrategy(
    {
      consumerKey: 'ggav0NYrjucilG6qyLzXQhqY5',
      consumerSecret: 'EzseR9UJlENQa4LpVrIeli1wxsCgypCS6drTgCICsPR9la6Uif',
      includeEmail: true
    },
    (token, tokenSecret, profile, done) => {
      User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
        return done(err, user);
      });
    }
  )
);

var createToken = auth => {
  return jwt.sign(
    {
      id: auth.id
    },
    'my-secret',
    {
      expiresIn: 60 * 120
    }
  );
};

var generateToken = (req, res, next) => {
  req.token = createToken(req.auth);
  return next();
};

var sendToken = (req, res) => {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};

router.post('/twitter/reverse', (req, res) => {
  request.post(
    {
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http://127.0.0.1:3000/',
        consumer_key: 'ggav0NYrjucilG6qyLzXQhqY5',
        consumer_secret: 'EzseR9UJlENQa4LpVrIeli1wxsCgypCS6drTgCICsPR9la6Uif'
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
          consumer_key: 'ggav0NYrjucilG6qyLzXQhqY5',
          consumer_secret: 'EzseR9UJlENQa4LpVrIeli1wxsCgypCS6drTgCICsPR9la6Uif',
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

    // prepare token for API
    req.auth = {
      id: req.user.id
    };

    return next();
  },
  generateToken,
  sendToken
);

export default router;
