const express = require('express');
const router = express.Router();
const { getStory, ensureQueueSize } = require('../services/storyService');

router.get('/', async (req, res) => {
  try {
    const story = await getStory();
    res.json({ story });
    ensureQueueSize().catch(console.error);
  } catch (error) {
    console.error('获取故事时出错:', error);
    res.status(500).json({ error: '获取故事时遇到了问题。请稍后再试。' });
  }
});

module.exports = router;