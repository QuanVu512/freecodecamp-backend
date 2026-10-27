import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { authenticate } from "./middleware/authenticate.js";
import { authorizeModification } from "./middleware/authorize.js";
import {
  findByUsername,
  findById,
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "./utils/db.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Helper: Ép đúng kiểu ID (số hoặc chuỗi) để khớp với db.js
function resolveUser(paramId) {
  return findById(paramId) || findById(Number(paramId));
}

// ==========================================
// AUTH ROUTE: POST /api/auth/login
// ==========================================
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  // 1. Thiếu username hoặc password -> 400
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // 2. Không tìm thấy username -> 401
  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 3. So khớp mật khẩu với bcryptjs (hỗ trợ cả passwordHash và password)
  const hash = user.passwordHash || user.password;
  let isValid = false;
  if (hash) {
    isValid = await bcrypt.compare(password, hash);
    if (!isValid && hash === password) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 4. Cấp JWT token hợp lệ
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
});

// ==========================================
// WATCHLIST ROUTES: /api/watchlist
// ==========================================
app.use("/api/watchlist", authenticate);

// GET /api/watchlist/:userId
app.get("/api/watchlist/:userId", (req, res) => {
  const targetUser = resolveUser(req.params.userId);
  const targetId = targetUser ? targetUser.id : req.params.userId;

  const watchlist = getWatchlist(targetId);
  return res.status(200).json(watchlist || []);
});

// POST /api/watchlist/:userId/movies
app.post("/api/watchlist/:userId/movies", authorizeModification, (req, res) => {
  const targetUser = resolveUser(req.params.userId);
  const targetId = targetUser ? targetUser.id : req.params.userId;

  const movie = addMovie(targetId, req.body);
  return res.status(201).json(movie);
});

// PUT /api/watchlist/:userId/movies/:movieId
app.put("/api/watchlist/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const targetUser = resolveUser(req.params.userId);
  const targetId = targetUser ? targetUser.id : req.params.userId;
  const movieId = !isNaN(Number(req.params.movieId))
    ? Number(req.params.movieId)
    : req.params.movieId;

  const updated = updateMovie(targetId, movieId, req.body);
  return res.status(200).json(updated);
});

// DELETE /api/watchlist/:userId/movies/:movieId
app.delete("/api/watchlist/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const targetUser = resolveUser(req.params.userId);
  const targetId = targetUser ? targetUser.id : req.params.userId;
  const movieId = !isNaN(Number(req.params.movieId))
    ? Number(req.params.movieId)
    : req.params.movieId;

  deleteMovie(targetId, movieId);
  return res.status(200).json({ message: "Movie deleted" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;