/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-bunny
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { generateStory, getStory } = require('../services/storyService');

router.post('/', [
  body('prompt').isString().trim().isLength({ min: 1, max: 500 }).withMessage('提示必须是1-500字符的字符串')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // 直接等待故事生成
    const story = await generateStory(req.body.prompt);
    res.json({ story });
  } catch (error) {
    console.error('生成自定义故事时出错:', error);
    res.status(500).json({ error: '生成故事时遇到了问题' });
  }
});

// 保留随机故事生成的路由
router.get('/', async (req, res) => {
  try {
    const story = await getStory();
    res.json({ story });
  } catch (error) {
    console.error('获取随机故事时出错:', error);
    res.status(500).json({ error: '获取故事时遇到了问题' });
  }
});

module.exports = router;