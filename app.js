const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

module.exports = app;