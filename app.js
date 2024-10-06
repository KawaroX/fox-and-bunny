require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Redis 配置
let redis;
try {
  redis = new Redis(process.env.REDIS_URL, {
    connectTimeout: 10000,
    commandTimeout: 5000,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });
} catch (error) {
  console.error('Failed to create Redis instance:', error);
}

redis.on('error', (error) => {
  console.error('Redis error:', error);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

// 检查 Redis 连接
async function checkRedisConnection() {
  if (!redis) {
    console.error('Redis client not initialized');
    return false;
  }
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}

async function generateStory(prompt = "请生成一个简短的故事：") {
  try {
    const response = await axios.post('https://api.deepbricks.ai/v1/chat/completions', {
      prompt: prompt,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('API Response:', response.data);
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('生成故事时出错:', error.response ? error.response.data : error.message);
    return '抱歉，生成故事时遇到了问题。';
  }
}

async function getOrGenerateStory() {
  if (!(await checkRedisConnection())) {
    console.warn('Redis unavailable, generating new story without caching');
    return await generateStory();
  }

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
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;