import express from 'express';
import request from 'request';

const router = express.Router();

router.get('/twitter/timeline', (req, res, next) => {
  request.get(
    {
      url: `https://api.twitter.com/1.1/statuses/home_timeline.json`,
      oauth: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token: process.env.TOKEN
      }
    },
    (err, r, body) => {
      if (err) {
        return res.send(500, { message: err.message });
      }

      const bodyString =
        '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';

      res.status(200).json(body);
    }
  );
});

export default router;
