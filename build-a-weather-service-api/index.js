import express from 'express';
import path from 'path';
import weatherRouter from './weather.js';

const app = express();
const PORT = 3000;

// Node.js 20.11+ native directory resolver for ES modules
const __dirname = import.meta.dirname;

// 1. Serving Static Files
app.use(express.static(path.join(__dirname, "public")));

// 2. Modular Routing
app.use("/api/weather", weatherRouter);

// 3. Simple Route
app.get("/", (req, res) => {
    res.status(200);
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/greet/:name", (req, res) => {
  const { name } = req.params;

  res.status(200).json({
    message: `Hello, ${name}!`,
    name: name
  });
});

  app.route("/api/data")
  .get((req, res) => {
    res.status(200).json({ message: "Data retrieved successfully" });
  })
  .post((req, res) => {
    res.status(201).json({ message: "Data created successfully" });
  });

app.get("/api/info", (req, res) => {
  res.status(200).json({
    name: "Weather Service API",
    description: "An API providing weather information",
    version: "1.0.0",
    endpoints: [
      "/api/info",
      "/api/greet/:name",
      "/api/data",
      "/api/weather",
      "/api/weather/:city"
    ]
  });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({
    name: "Status API",
    status: "ACTIVE"
  });
});
app.get("/docs", (req, res) => {
    res.redirect('/api/status');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test API endpoint: http://localhost:${PORT}/api/weather/London`);
});