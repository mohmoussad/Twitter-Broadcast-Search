const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/search', (req, res) => {
  res.send(JSON.parse('{"msg":"No search input provided"}'));
});

app.get('/search/:searchInput', async (req, res) => {
  const searchInput = req.params.searchInput;

  // Guest Token Generation
  const tokenRes = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
    headers: {
      Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    },
    method: 'POST',
  });
  const { guest_token: guestToken } = await tokenRes.json();

  // Fetching Data
  const fetchAPI = await fetch(`https://twitter.com/i/api/2/search/adaptive.json?q=${searchInput} بث`, {
    headers: {
      authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      'x-guest-token': `${guestToken}`,
    },
    body: null,
    method: 'GET',
  });
  const data = await fetchAPI.json();

  // Mapping Data
  const tweets = Object.keys(data.globalObjects.tweets).map((item) => data.globalObjects.tweets[item]);
  const brodcastsTweets = tweets.filter((tweet) => {
    return tweet?.entities?.urls[0]?.expanded_url.includes('broadcasts');
  });
  const brodcastsLinks = [...new Set(brodcastsTweets.map((item) => item.entities.urls[0].expanded_url))];
  if (brodcastsLinks == 0) {
    return res.send(JSON.parse(`{"msg":"Your search didn't match any result."}`));
  }
  return res.send(brodcastsLinks);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
