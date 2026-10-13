import express from 'express';

const router = express.Router();

// 1. Define the SUPPORTED_CITIES array
export const SUPPORTED_CITIES = [
  "New York",
  "Chicago",
  "Los Angeles",
  "Tokyo",
  "London"
];

const BASE_URL = "https://weather-proxy.freecodecamp.rocks/api/city";

// 2. GET / route on the router (accessed via /api/weather)
router.get("/", (req, res) => {
  res.status(200).json({ cities: SUPPORTED_CITIES });
});

// Dynamic city route
router.get("/:city", async (req, res) => {
  const city = req.params.city;
  const apiUrl = `${BASE_URL}/${city}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const apiData = await response.json();

    const weatherData = {
      city: apiData.name,
      country: apiData.sys.country,
      temperature: apiData.main.temp,
      description: apiData.weather[0].description,
      iconUrl: apiData.weather[0].icon,
    };

    res.status(200).json(weatherData);
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);

    res.status(404).json({
      error: `Could not fetch weather data for "${city}".`,
      hint: "The proxy API only supports: New York, Chicago, Los Angeles, Tokyo, and London.",
    });
  }
});

export default router;