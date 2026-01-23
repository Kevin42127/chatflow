require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const chatRoutes = require('./routes/chat');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(express.static(path.join(__dirname, '..')));

app.get('/download.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'download.html'));
});

app.get('/download.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'download.css'));
});

app.get('/download.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'download.js'));
});

app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'download.html'));
});

app.use('/assets', express.static(path.join(__dirname, '..', 'mobile', 'assets')));

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
