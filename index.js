if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const moment = require("moment");

const app = express();
const port = process.env.PORT;

const API_KEY = process.env.API_KEY;

app.use(cors());

const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

// TODO: Add an endpoint for encrypting / decrypting localStorage stats

app.get("/stats/:ID", (req, res) => {
  const youtubeID = req.params.ID;

  const calculateStats = () => {};
  youtube.videos
    .list({
      id: youtubeID,
      part: ["statistics", "contentDetails"],
    })
    .then((response) => {
      const statistics = response.data.items[0].statistics;
      const contentDetails = response.data.items[0].contentDetails;

      const duration = moment.duration(contentDetails.duration);

      const stats = {
        level: 1,
        formality: 0,
        curiousity: 0,
        creativity: 0,
        compassion: 0,
      };

      // Block for stats calculations
      statistics.viewCount < 25000
        ? (stats.curiousity += 2)
        : (stats.curiousity -= 1);

      if (parseInt(statistics.likeCount) < parseInt(statistics.dislikeCount)) {
        stats.compassion -= 2;
      }

      if (parseInt(statistics.likeCount) > parseInt(statistics.viewCount) / 100)
        stats.compassion += 1;

      if (
        parseInt(statistics.dislikeCount) >
        parseInt(statistics.viewCount) / 100
      )
        stats.formality -= 1;

      parseInt(statistics.commentCount) > parseInt(statistics.viewCount) / 1000
        ? (stats.curiousity += 1)
        : (stats.creativity -= 1);

      if (
        parseInt(statistics.favoriteCount) >
        parseInt(statistics.viewCount) / 1000
      )
        stats.formality += 1;

      if (duration.hours > 0) formality += 1;
      if (duration.hours === 0 && duration.minutes > 30) stats.creativity += 1;
      if (
        duration.hours == 0 &&
        duration.minutes <= 30 &&
        duration.minutes >= 5
      )
        commpassion += 1;
      if (duration.hours === 0 && duration.minutes < 5) stats.curiousity += 1;

      if (contentDetails.caption === "true") stats.formality += 2;
      contentDetails.licensedContent === "true"
        ? (stats.creativty -= 1)
        : (stats.creativity += 1);

      if (contentDetails.definition === "sd") stats.formality -= 1;

      res.status(200).send(stats);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error obtaining data from youtube API");
    });
});

app.listen(port, () => {
  console.log(`Jackbox Homework Backend running on port ${port}`);
});
