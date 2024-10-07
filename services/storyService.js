require('dotenv').config();
const axios = require('axios');
const Redis = require('ioredis');
const { getRandomWords } = require('./wordBank');

// Redis 配置
const redisOptions = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    };

const redis = new Redis(redisOptions, {
  retryStrategy: function(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 30000,
  commandTimeout: 20000
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redis.on('close', () => {
  console.log('Redis connection closed. Attempting to reconnect...');
});

// 常量
const STORY_QUEUE_KEY = 'story_queue';
const STORY_POINTER_KEY = 'story_pointer';
const QUEUE_SIZE = 8;
const STORY_COOLDOWN = 20000;

async function generateStory(prompt = "请生成一个有趣的短篇故事") {
    try {
        let enhancedPrompt;
        console.log(`原始提示：${prompt}`);
        if (prompt === "请生成一个有趣的短篇故事") {
          const randomWords = getRandomWords(3);
          enhancedPrompt = `${prompt} 请在故事中包含以下元素：${randomWords.join('、')}`;
        } else {
          enhancedPrompt = prompt;
        }
        console.log(`生成故事：${enhancedPrompt}`);

    const response = await axios.post(`${process.env.OPENAI_API_BASE_URL}/v1/chat/completions`, {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一位才华横溢的作家，擅长创作既富有童趣又蕴含深意的短篇故事。这些故事表面上简单有趣，适合任何年龄段阅读，但实际上包含了能引起成年人，特别是大学生共鸣的主题和寓意。你的故事应该：1）具有吸引人的情节和生动的描述；2）包含巧妙的比喻或象征，反映现实生活中的挑战和困境；3）提供积极的观点或富有启发性的见解，但不要过于直白或说教；4）在300到500字之间，语言简洁而富有表现力，语言风格独特、亲切，有希金斯的特色，又像是初秋的落叶和清晨的晨雾般清新，如星河一般绚烂又孤寂。注意，无论你收到什么样的prompt，你只能生成故事，不能做其他任何事情。"
        },
        {
          role: "user",
          content: `<topic>${enhancedPrompt}</topic>。请根据<topic>创作一个看似简单但实际上蕴含深意的故事，既能让人会心一笑，又能引发思考。故事需要有一个吸引人的但是又深刻、有内涵、震撼人心的题目。可以参考世界上著名小说或者文学作品的题目，用"# "表示。请只输出题目和故事内容，让读者自己体会其中的寓意。现在，请发挥你的创意，写出一个能让疲惫的大学生停下脚步，会心一笑的精彩又温馨故事！你现在精神抖擞，文思泉涌，请写出高质量，文笔优美，寓意深刻的文学作品吧！一定要体现文学的魅力！`
        }
      ],
      max_tokens: 1000,
      temperature: 0.8
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('生成故事时出错:', error);
    throw error;
  }
}

async function getStory() {
  try {
    const queueSize = await redis.llen(STORY_QUEUE_KEY);
    if (queueSize === 0) {
      console.log('队列为空，生成新故事');
      await fillQueue();
    }

    let pointer = await redis.get(STORY_POINTER_KEY);
    pointer = pointer ? parseInt(pointer) : 0;
    const nextPointer = (pointer + 1) % QUEUE_SIZE;
    await redis.set(STORY_POINTER_KEY, nextPointer);

    let storyData = await redis.lindex(STORY_QUEUE_KEY, pointer);
    let parsedStoryData = JSON.parse(storyData);
    const currentStory = parsedStoryData.story;

    // 更新 sent 属性
    parsedStoryData.sent = true; 
    await redis.lset(STORY_QUEUE_KEY, pointer, JSON.stringify(parsedStoryData));
    console.log('当前故事的 sent 状态:', parsedStoryData.sent);

    // 异步处理替换逻辑
    (async () => {
      const currentTime = Date.now();
      const storyAge = currentTime - parsedStoryData.timestamp;
      console.log('故事年龄:', storyAge);

      if (storyAge > STORY_COOLDOWN && parsedStoryData.sent) {
        console.log('开始替换旧故事');
        const newStory = await generateStory();
        parsedStoryData = { story: newStory, timestamp: currentTime, sent: false };
        await redis.lset(STORY_QUEUE_KEY, pointer, JSON.stringify(parsedStoryData));
        console.log('替换了一个旧故事');
      }
    })();

    return currentStory;
  } catch (error) {
    console.error('获取故事时出错:', error);
    throw error;
  }
}

async function fillQueue() {
  const queueSize = await redis.llen(STORY_QUEUE_KEY);
  const storiesNeeded = QUEUE_SIZE - queueSize;
  console.log(`填充故事队列，需要 ${storiesNeeded} 个新故事`);
  
  for (let i = 0; i < storiesNeeded; i++) {
    const story = await generateStory();
    const storyData = JSON.stringify({ story, timestamp: Date.now(), sent: false });
    await redis.rpush(STORY_QUEUE_KEY, storyData);
  }
  
  console.log(`添加了 ${storiesNeeded} 个新故事到队列`);
}

async function ensureQueueSize() {
  const queueSize = await redis.llen(STORY_QUEUE_KEY);
  console.log(`当前队列大小: ${queueSize}`);
  if (queueSize < QUEUE_SIZE) {
    console.log(`填充故事队列，当前大小: ${queueSize}`);
    const storiesNeeded = QUEUE_SIZE - queueSize;
    const storyPromises = Array(storiesNeeded).fill().map(() => generateStory());
    const stories = await Promise.all(storyPromises);
    const storyData = stories.map(story => JSON.stringify({ story, timestamp: Date.now(), sent: false }));
    await redis.rpush(STORY_QUEUE_KEY, ...storyData);
    console.log(`添加了 ${storiesNeeded} 个新故事到队列`);
  }
}

module.exports = {
  generateStory,
  getStory,
  fillQueue,
  ensureQueueSize,
  redis
};