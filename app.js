require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');
const path = require('path');

const app = express();
const redis = new Redis(process.env.REDIS_URL);

app.use(express.json());
app.use(express.static('public'));

async function generateStory(prompt = "请生成一个简短的故事：") {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: prompt,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('生成故事时出错:', error);
    return '抱歉，生成故事时遇到了问题。';
  }
}

async function getOrGenerateStory() {
  let story = await redis.get('cached_story');
  const lastGenerationTime = await redis.get('last_generation_time');
  const currentTime = Date.now();

  if (!story || !lastGenerationTime || currentTime - parseInt(lastGenerationTime) > 5000) {
    story = await generateStory();
    await redis.set('cached_story', story);
    await redis.set('last_generation_time', currentTime.toString());
  }

  return story;
}

app.get('/api/story', async (req, res) => {
  try {
    const story = await getOrGenerateStory();
    res.json({ story });
  } catch (error) {
    console.error('处理请求时出错:', error);
    res.status(500).json({ error: '获取故事时遇到了问题。' });
  }
});

app.post('/api/custom-story', async (req, res) => {
  try {
    const { prompt } = req.body;
    const story = await generateStory(prompt);
    res.json({ story });
  } catch (error) {
    console.error('处理自定义故事请求时出错:', error);
    res.status(500).json({ error: '生成自定义故事时遇到了问题。' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Fox and Rabbit Story Generator running on port ${port}`);
});