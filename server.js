const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const axios = require("axios");

app.set("view engine", "hbs");

app.engine(
  "hbs",
  exphbs({
    layoutsDir: __dirname + "/views/layouts",
    extname: ".hbs",
    partialsDir: __dirname + "/views/partials",
  })
);

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/api", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/", (req, res) => {
  axios
    .get("https://yts.mx/api/v2/list_movies.json?sort_by=year&limit=50")
    .then((resp) => {
      const {
        data: { movies, page_number },
      } = resp.data;
      res.render("main", {
        layout: "home",
        title: "TorStreamr",
        page_number,
        movies,
      });
    })
    .catch((e) => {
      res.send("Error");
    });
});

app.get("/movie", (req, res) => {
  const { id } = req.query;
  axios
    .get(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
    )
    .then((resp) => {
      const {
        data: { movie },
      } = resp.data;

      const magnet =
        "magnet:?xt=urn:btih:" +
        movie.torrents[0].hash +
        "&dn=" +
        movie.title_long +
        "&tr=udp://tracker.cyberia.is:6969/announce&tr=udp://tracker.port443.xyz:6969/announce&tr=http://tracker3.itzmx.com:6961/announce&tr=udp://tracker.moeking.me:6969/announce&tr=http://vps02.net.orel.ru:80/announce&tr=http://tracker.openzim.org:80/announce&tr=udp://tracker.skynetcloud.tk:6969/announce&tr=https://1.tracker.eu.org:443/announce&tr=https://3.tracker.eu.org:443/announce&tr=http://re-tracker.uz:80/announce&tr=https://tracker.parrotsec.org:443/announce&tr=udp://explodie.org:6969/announce&tr=udp://tracker.filemail.com:6969/announce&tr=udp://tracker.nyaa.uk:6969/announce&tr=udp://retracker.netbynet.ru:2710/announce&tr=http://tracker.gbitt.info:80/announce&tr=http://tracker2.dler.org:80/announce";
      res.render("movie", {
        layout: "movie_details",
        movie,
        title: movie.title,
        poster: movie.large_screenshot_image1,
        magnet,
      });
    })
    .catch((e) => {
      res.send("Error");
    });
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
