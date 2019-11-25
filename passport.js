import passport from 'passport';
import TwitterTokenStrategy from 'passport-twitter-token';

import User from './models/User';
import * as twitterConfig from './twitter.config';

export default () => {
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
};
