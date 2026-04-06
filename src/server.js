require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  process.stdout.write(`Server is running on port ${PORT}\n`);
  process.stdout.write(`Health check: http://localhost:${PORT}/health\n`);
  process.stdout.write(`XYP API: http://localhost:${PORT}/api/xyp\n`);
});