require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// 允许 Express 识别代理
app.set('trust proxy', true);

const { body, validationResult } = require('express-validator');



const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制每个 IP 15 分钟内最多 100 个请求
  message: '请求过于频繁，请稍后再试。'
});

// 将限制器应用到所有的 /api 路由
app.use('/api', apiLimiter);

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

async function generateStory(prompt = "请生成一个有趣的短篇故事") {
  try {
    const response = await axios.post('https://api.deepbricks.ai/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "你是一个专业的儿童故事作家。你的任务是创作富有想象力、有教育意义、适合儿童的短篇故事。故事应该包含引人入胜的情节、生动的描述和有趣的对话。每个故事应该有一个明确的主题或道德寓意，但要以巧妙和吸引人的方式呈现。故事长度应该在300到500字之间。文笔要优美语言流畅自然，颇有希金斯的风味，你的文字让人感觉像是秋天的落叶与清晨的雾气，在浩瀚璀璨的星海里飘荡着一叶孤舟，如银河般灿烂，如月球般纯洁，如月球海啸一般震撼。"
        },
        { 
          role: "user", 
          content: `请根据以下提示创作一个故事：${prompt}。注意，故事需要有一个题目，你要输出的只有题目和故事，不需要指出你的故事的寓意等，这些让读者通过阅读你的故事自己体会。` 
        }
      ],
      max_tokens: 1000,  // 增加 token 限制以允许更长的故事
      temperature: 0.8   // 增加创造性
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    const story = response.data.choices[0].message.content.trim();
    return story;
  } catch (error) {
    console.error('生成故事时出错:', error);
    throw error;
  }
}

async function getOrGenerateStory() {
  try {
    console.log('开始获取或生成故事');

    // 立即获取缓存的故事
    let story = await redis.get('cached_story');
    const lastGenerationTime = await redis.get('last_generation_time');
    const currentTime = Date.now();

    console.log('缓存状态:', { story: !!story, lastGenerationTime, currentTime });

    // 立即返回缓存的故事
    if (story) {
      console.log('使用缓存的故事, 长度:', story.length);
      // 检查生成时间是否超过5秒
      if (lastGenerationTime && currentTime - parseInt(lastGenerationTime) > 5000) {
        console.log('缓存的故事存在时间超过5秒，开始生成新故事');
        // 生成新故事但不等待
        generateAndCacheStory();
      }
      return story; // 立即返回缓存的故事
    } else {
      console.log('没有找到缓存的故事，生成新故事');
      story = await generateStory(); // 如果没有缓存的故事，生成新的
      await redis.set('cached_story', story);
      await redis.set('last_generation_time', currentTime.toString());
      return story;
    }
  } catch (error) {
    console.error('获取或生成故事时出错:', error);
    throw error;
  }
}

// 后台生成并缓存新故事的函数
async function generateAndCacheStory() {
  try {
    console.log('开始后台生成新故事');
    const newStory = await generateStory(); // 调用API生成新故事
    const currentTime = Date.now();

    // 确保新故事成功缓存
    await redis.set('cached_story', newStory); // 更新缓存中的故事
    await redis.set('last_generation_time', currentTime.toString()); // 更新生成时间
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

app.post('/api/custom-story', [
  body('prompt').isString().trim().isLength({ min: 1, max: 500 }).withMessage('提示必须是1-500字符的字符串')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const story = await generateStory(req.body.prompt);
    res.json({ story });
  } catch (error) {
    console.error('处理请求时出错:', error);
    res.status(500).json({ error: '生成故事时遇到了问题。请稍后再试。' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;