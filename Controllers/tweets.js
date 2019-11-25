import Twitter from 'twitter';

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN
});

class Tweets {
  static async getTimelineasync(req, res, next) {
    const params = { screen_name: 'nodejs' };

    await client.get('statuses/user_timeline', params, function(
      error,
      tweets,
      response
    ) {
      if (!error) {
        console.log(tweets.length);
        const data = [];
        tweets.map(tweet => {
          data.push({
            id: tweet.id,
            id_str: tweet.id_str,
            text: tweet.text,
            created_at: tweet.created_at,
            user: {
              userId: tweet.user.id_str,
              name: tweet.user.name,
              screen_name: tweet.user.screen_name,
              location: tweet.user.location,
              description: tweet.user.description,
              profile_image_url: tweet.user.profile_image_url
            }
          });
        });
        res.send(data);
      }
      if (error) {
        console.log(error);
        res.send(error);
      }
    });
  }
}

export default Tweets;
