const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const storyRoutes = require('./api/story');
const customStoryRoutes = require('./api/custom-story');

const app = express();

// 中间件设置（保持不变）
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: '请求过于频繁，请稍后再试。',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// 使用新的路由
app.use('/api/story', storyRoutes);
app.use('/api/custom-story', customStoryRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;