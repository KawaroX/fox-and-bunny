const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { generateStory, redis } = require('../services/storyService');

router.post('/', [
  body('prompt').isString().trim().isLength({ min: 1, max: 500 }).withMessage('提示必须是1-500字符的字符串')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const taskId = Date.now().toString();
  res.json({ taskId: taskId, message: '故事生成中，请稍后查询结果' });

  // 异步生成故事
  generateStory(req.body.prompt).then(story => {
    redis.set(`story:${taskId}`, JSON.stringify({ status: 'completed', story }), 'EX', 3600);
  }).catch(error => {
    console.error('生成自定义故事时出错:', error);
    redis.set(`story:${taskId}`, JSON.stringify({ status: 'error', message: '生成故事时遇到了问题' }), 'EX', 3600);
  });
});

router.get('/status/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const result = await redis.get(`story:${taskId}`);
  if (result) {
    res.json(JSON.parse(result));
  } else {
    res.json({ status: 'pending' });
  }
});

module.exports = router;