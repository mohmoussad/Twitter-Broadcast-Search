const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));

/* Define Constants */
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

/* Helpers */
const getGuestToken = async () => {
  const response = await fetch(
    "https://api.twitter.com/1.1/guest/activate.json",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  const { guest_token } = await response.json();

  return guest_token;
};

const fetchTwitter = async (url) => {
  const guestToken = await getGuestToken();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "x-guest-token": guestToken,
    },
  });

  const data = await response.json();

  return data;
};

/* Routes */
app.get("/search/:query", async (req, res) => {
  const query = req.params.query;

  const response = await fetchTwitter(
    `https://twitter.com/i/api/2/search/adaptive.json?q=${query}`
  );

  const broadcasts = Object.values(response.globalObjects.tweets).filter(
    (tweet) => {
      return tweet?.entities?.urls[0]?.expanded_url.includes("broadcasts");
    }
  );

  const links = [
    ...new Set(broadcasts.map((item) => item.entities.urls[0].expanded_url)),
  ];

  if (links.length == 0) {
    return res.json({ msg: "Your search didn't match any result." });
  }

  return res.send(links);
});

app.get("/check/:link", async (req, res) => {
  const link = req.params.link;

  const response = await fetchTwitter(
    `https://twitter.com/i/api/1.1/broadcasts/show.json?ids=${link}`
  );

  const isRunning = response.broadcasts[link]?.state == "RUNNING";

  return res.json({ running: isRunning });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
