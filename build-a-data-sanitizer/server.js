import express from 'express';
import path from 'path';
import { inputCleaner, inputValidator } from './middleware.js';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Sửa Test 2: Đặt route redirect này trước static
app.get('/', (req, res) => {
  res.redirect('/form');
});

// Chặn express.static tự ý phục vụ index.html tại route '/'
app.use(express.static('public', { index: false }));

// 2. Test 3: Trả về file giao diện khi vào /form
app.get('/form', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// 3. Test 7, 8, 9: Route submit
app.post('/submit', inputCleaner, inputValidator, (req, res) => {
  res.json({
    username: req.body.username,
    comment: req.body.comment
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;