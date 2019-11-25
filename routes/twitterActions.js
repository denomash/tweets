import express from 'express';
import Tweets from '../Controllers/tweets';

const router = express.Router();

router.get('/twitter/timeline', Tweets.getTimelineasync);

export default router;
