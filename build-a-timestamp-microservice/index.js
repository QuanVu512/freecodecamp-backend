import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Phục vụ static files (nếu có thư mục public)
app.use(express.static('public'));

// Trang chủ (nếu có views/index.html)
app.get('/', (req, res) => {
  res.sendFile(import.meta.dirname + '/views/index.html');
});

// Middleware thiết lập header CORS thủ công (không cần cài thêm package cors)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

// Hàm xử lý chung cho Timestamp API
const handleTimestamp = (req, res) => {
  const { date: dateParam } = req.params;
  let date;

  // 1. Không truyền date -> Lấy thời gian hiện tại
  if (!dateParam) {
    date = new Date();
  }
  // 2. dateParam chỉ gồm các chữ số (Unix timestamp ms) -> ép sang Number
  else if (/^-?\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam, 10));
  }
  // 3. dateParam là chuỗi ngày tháng thông thường
  else {
    date = new Date(dateParam);
  }

  // Kiểm tra tính hợp lệ
  if (isNaN(date.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  // Trả về JSON hợp lệ
  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
};

// Định tuyến hỗ trợ cả /api và /api/:date
app.get('/api', handleTimestamp);
app.get('/api/:date', handleTimestamp);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});