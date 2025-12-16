const app = require('./api/index.js');
const port = 3001;

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
