const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Mental Health Companion API running' });
});

// Journaling endpoint
app.post('/journal', (req, res) => {
  const { text } = req.body;
  // Later: send to ML service
  res.json({ sentiment: 'positive', emotions: ['calm'], stress: 'low' });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
