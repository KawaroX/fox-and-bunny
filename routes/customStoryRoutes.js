/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-rabbit
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { generateCustomStoryWithTimeout, getCustomStoryStatus, redis } = require('../services/storyService');

router.post('/', [
  body('prompt').isString().trim().isLength({ min: 1, max: 500 }).withMessage('提示必须是1-500字符的字符串')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const result = await generateCustomStoryWithTimeout(req.body.prompt);
    if (result.status === 'completed') {
      res.json({ story: result.story });
    } else {
      // 如果超时，开始后台生成过程
      setImmediate(async () => {
        try {
          const story = await generateStory(req.body.prompt);
          await redis.set(`custom_story:${result.taskId}`, JSON.stringify({ status: 'completed', story }), 'EX', 3600);
        } catch (error) {
          await redis.set(`custom_story:${result.taskId}`, JSON.stringify({ status: 'error', error: error.message }), 'EX', 3600);
        }
      });
      res.json({ taskId: result.taskId });
    }
  } catch (error) {
    console.error('生成自定义故事时出错:', error);
    res.status(500).json({ error: '生成故事时遇到了问题' });
  }
});

router.get('/status/:taskId', async (req, res) => {
  try {
    const status = await getCustomStoryStatus(req.params.taskId);
    res.json(status);
  } catch (error) {
    console.error('检查故事状态时出错:', error);
    res.status(500).json({ error: '检查故事状态时遇到了问题' });
  }
});

module.exports = router;