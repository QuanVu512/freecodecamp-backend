import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
// freeCodeCamp test runner fetch vào cổng 8000
const PORT = process.env.PORT || 8000;

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'views', 'index.html'));
});

// Hàm xử lý ngày tháng
function parseDateParam(dateParam) {
  // 1. Tham số rỗng -> Lấy thời gian hiện tại
  if (!dateParam || dateParam.trim() === '') {
    const now = new Date();
    return {
      unix: now.getTime(),
      utc: now.toUTCString()
    };
  }

  let date;
  // 2. Tham số chỉ gồm chữ số (Unix timestamp mili-giây)
  if (/^-?\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam, 10));
  } else {
    // 3. Chuỗi ngày thông thường
    date = new Date(dateParam);
  }

  // 4. Ngày không hợp lệ
  if (isNaN(date.getTime())) {
    return { error: 'Invalid Date' };
  }

  return {
    unix: date.getTime(),
    utc: date.toUTCString()
  };
}

// Định tuyến
app.get('/api', (req, res) => {
  res.json(parseDateParam(null));
});

app.get('/api/:date', (req, res) => {
  res.json(parseDateParam(req.params.date));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});