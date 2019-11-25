import request from 'request';

class AuthController {
  static requestToken(req, res) {
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

        res.json(JSON.parse(jsonStr));
      }
    );
  }

  static twitterAuthorisation(req, res, next) {
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

        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        return next();
      }
    );
  }

  static returnUser(req, res, next) {
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
}

export default AuthController;
