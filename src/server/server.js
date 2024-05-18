projectData = [];

const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

// Key WEATHERBIT
let API_KEY_W = "c164220a5a6e4906a98a666900efd12a";
// Key PIXABAY
let API_KEY_P = "37677660-4758ea2810adabaced99dfc19";

const bodyParser = require("body-parser");

app.use(cors());

app.use(express.static("dist"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.post("/", async (req, res) => {
  // Input
  location = req.body.location;
  date = req.body.date;
  // Fetch APIs geonames
  const meaningUrl = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=buiduy057`;
  try {
    await axios
      .get(meaningUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .then(async (data) => {
        await fetchDataWeather(data, location, date, res);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } catch (error) {
    console.log(error.message);
  }
});

// Fetch APIs weatherbit

const fetchDataWeather = async (dataGeonames, search, date, res) => {
  await axios
    .get(
      `https://api.weatherbit.io/v2.0/current?lat=${dataGeonames.geonames[0].lat}&lon=${dataGeonames.geonames[0].lng}&key=${API_KEY_W}&include=minutely&start_date=${date}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .then(async (data) => {
      await fetchDataPixabay(dataGeonames, data, search, res);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
// Fetch APIs pixabay
const fetchDataPixabay = async (dataGeonames, dataWeather, search, res) => {
  await axios
    .get(
      `https://pixabay.com/api/?key=${API_KEY_P}&q=${search}&image_type=photo`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      // Output
      res.send({
        lat: dataGeonames.geonames[0].lat,
        lot: dataGeonames.geonames[0].lng,
        weather: dataWeather.data[0].weather,
        temp: dataWeather.data[0].temp,
        image: data.hits[0].largeImageURL,
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
