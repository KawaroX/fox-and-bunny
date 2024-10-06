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
        model: "gpt-4o-mini", // 或其他适合的模型
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 150
        }, {
            headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
            }
        });
        console.log('API Response:', response.data);
        return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('生成故事时出错:', error.response ? error.response.data : error.message);
      return '抱歉，生成故事时遇到了问题。';
    }
}

async function getOrGenerateStory() {
try {
    console.log('开始获取或生成故事');
    let story = await redis.get('cached_story');
    let lastGenerationTime = await redis.get('last_generation_time');
    const currentTime = Date.now();

    console.log('缓存状态:', { story: !!story, lastGenerationTime, currentTime });

    // 如果没有缓存的故事，立即生成一个
    if (!story) {
    console.log('没有缓存的故事，正在生成新故事');
    story = await generateStory();
    console.log('新故事生成完成:', story.substring(0, 50) + '...');
    
    await redis.set('cached_story', story);
    await redis.set('last_generation_time', currentTime.toString());
    console.log('新故事已缓存');
    } else {
    console.log('使用缓存的故事');
    }

    // 检查是否需要在后台生成新故事
    if (!lastGenerationTime || currentTime - parseInt(lastGenerationTime) > 5000) {
    console.log('缓存的故事已超过5秒，在后台生成新故事');
    generateAndCacheStory().catch(console.error);
    }

    return story;
} catch (error) {
    console.error('获取或生成故事时出错:', error);
    throw error;
}
}

// 后台生成并缓存新故事的函数
async function generateAndCacheStory() {
try {
    const newStory = await generateStory();
    const currentTime = Date.now();
    await redis.set('cached_story', newStory);
    await redis.set('last_generation_time', currentTime.toString());
    console.log('新故事已在后台生成并缓存');
} catch (error) {
    console.error('后台生成新故事时出错:', error);
}
}

app.get('/api/story', async (req, res) => {
try {
    console.log('收到获取故事的请求');
    const story = await getOrGenerateStory();
    console.log('成功获取故事，长度:', story.length);
    res.json({ story });
} catch (error) {
    console.error('处理请求时出错:', error);
    if (error.response) {
    console.error('API错误响应:', error.response.data);
    console.error('API错误状态码:', error.response.status);
    } else if (error.request) {
    console.error('未收到API响应');
    } else {
    console.error('请求设置错误:', error.message);
    }
    res.status(500).json({ error: '获取故事时遇到了问题。请稍后再试。' });
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