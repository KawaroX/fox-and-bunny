require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const redis = new Redis({
  port: 18082, // 使用您的实际端口
  host: 'redis-18082.c294.ap-northeast-1-2.ec2.redns.redis-cloud.com',
  password: 'DqBZ0De3NEiOeRtmkYTOLHPTS5r34sQi',
  retryStrategy: (times) => {
    if (times > 3) {
      return null; // 停止重试
    }
    return Math.min(times * 100, 3000); // 重试间隔，最大3秒
  },
  commandTimeout: 5000 // 设置命令超时为5秒
});

redis.on('error', (err) => console.error('Redis Error:', err));

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
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    const story = response.data.choices[0].message.content.trim();
    if (story.length < 20) { // 假设故事至少应该有20个字符
      throw new Error('Generated story is too short');
    }

    return story;
  } catch (error) {
    console.error('生成故事时出错:', error);
    throw error;
  }
}

async function getOrGenerateStory() {
  try {
    console.log('开始获取或生成故事');
    let story = await redis.get('cached_story');
    const lastGenerationTime = await redis.get('last_generation_time');
    const currentTime = Date.now();

    console.log('缓存状态:', { story: !!story, storyLength: story ? story.length : 0, lastGenerationTime, currentTime });

    if (!story || story.length < 20 || !lastGenerationTime || currentTime - parseInt(lastGenerationTime) > 5000) {
      console.log('需要生成新故事');
      story = await generateStory();
      console.log('新故事生成完成, 长度:', story.length);
      
      await redis.set('cached_story', story);
      await redis.set('last_generation_time', currentTime.toString());
      console.log('新故事已缓存');
    } else {
      console.log('使用缓存的故事, 长度:', story.length);
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
    let errorMessage = '获取故事时遇到了问题。请稍后再试。';
    if (error.response) {
      console.error('API错误响应:', error.response.data);
      errorMessage += ' API错误。';
    } else if (error.request) {
      console.error('未收到API响应');
      errorMessage += ' 网络问题。';
    } else {
      console.error('请求设置错误:', error.message);
      errorMessage += ' ' + error.message;
    }
    res.status(500).json({ error: errorMessage });
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