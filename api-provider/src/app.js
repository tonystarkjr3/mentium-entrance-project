const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ticketController = require('./controllers/ticketController');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.use('/tickets', ticketController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
