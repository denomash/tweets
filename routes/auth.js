import express from 'express';
import passport from 'passport';

import passportConfig from '../passport';
import AuthController from '../Controllers/auth';

const router = express.Router();

passportConfig();

router.post('/twitter/reverse', AuthController.requestToken);

router.post(
  '/twitter',
  AuthController.twitterAuthorisation,
  passport.authenticate('twitter-token', { session: false }),
  AuthController.returnUser
);

export default router;
