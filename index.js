if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { google } = require("googleapis");

const app = express();
const port = process.env.PORT;

const API_KEY = process.env.API_KEY;

const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

// TODO: Add an endpoint for encrypting / decrypting localStorage stats

app.get("/stats/:ID", (req, res) => {
  const youtubeID = req.params.ID;

  youtube.videos
    .list({
      id: youtubeID,
      part: ["statistics", "contentDetails"],
    })
    .then((response) => {
      const statistics = response.data.items[0].statistics;
      const contentDetails = response.data.items[0].contentDetails;

      console.log(statistics);
      console.log(contentDetails);

      res.status(200).send({
        statistics: statistics,
        contentDetails: contentDetails,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error obtaining data from youtube API");
    });
});

app.listen(port, () => {
  console.log(`Jackbox Homework Backend running on port ${port}`);
});
