const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const PORT = process.env.PORT || 5000;

const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  // {
  //   name: "guardian",
  //   address: "https://www.theguardian.com/environment/climate-crisis",
  //   base: "",
  // },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "cityam",
    address:
      "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/",
    base: "",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    base: "",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  // {
  //   name: "dm",
  //   address:
  //     "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
  //   base: "",
  // },
  {
    name: "nyp",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $(`a:contains("climate")`, html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url: newspaper.url,
          source: newspaper.name,
        });
      });
    })
    .catch((err) => console.log(err));
});

const articles = [];

app.get("/", (req, res) => {
  res.status(200).send("welcome to climate change news api");
});

app.get("/news", (req, res) => {
  res.send(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, (req, res) => {
  console.log(`server is running on port : ${PORT}`);
});
