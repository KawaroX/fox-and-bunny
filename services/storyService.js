/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-bunny
 */

require('dotenv').config();
const { getRandomWords } = require('./wordBank');
const axios = require('axios');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const { Gemini } = require("@google/generative-ai");

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
const STORY_GENERATION_TIMEOUT = 5000;

// API configuration
const useOpenRouter = process.env.USE_OpenRouter === 'true' && process.env.OPENROUTER_API_KEY;
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 60000; 
const MAX_TIMEOUT = 20000; 

// // 初始化 Google Generative AI
// const genAI = new Gemini(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   systemInstruction: "你是一位才华横溢的作家。创作300-500字的短篇故事，富有童趣且蕴含深意。适合任何年龄段阅读，特别吸引大学生。故事应具吸引力、生动、有启发性，避免说教。语言有表现力，风格独特亲切，文笔优美语言流畅自然。如果没有特别要求请使用中文，不要出现中英文混合的情况。故事应具吸引力、生动、有启发性，避免说教。",
// });

// const generationConfig = {
//   temperature: 1.2,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 800,
//   responseMimeType: "text/plain",
// };


async function generateStory(prompt = "请生成一个有趣的短篇故事") {
  try {
    let enhancedPrompt;
    console.log(`原始提示：${prompt}`);
    if (prompt === "请生成一个有趣的短篇故事。") {
      // const randomWords = getRandomWords(2);
      enhancedPrompt = `${prompt} 像是获得过诺贝尔文学奖的作家一样写作，作品有内涵，让读者着迷。`; //请 在故事中包含以下元素：${randomWords.join('、')}
    } else {
      enhancedPrompt = `${prompt} 。像是获得过诺贝尔文学奖的作家一样写作，作品有内涵，让读者着迷。`;
    }
    console.log(`生成故事：${enhancedPrompt}`);

    if (useOpenRouter) {
      try {
        return await retryOperation(() => generateStoryWithOpenRouter(enhancedPrompt));
      } catch (error) {
        console.warn('OpenRouter API 生成失败，尝试使用 Claude API:', error.message);
        try {
          return await retryOperation(() => generateStoryWithClaude(enhancedPrompt));
        } catch (error) {
          console.error('Claude API 生成失败，尝试使用 OpenAI API:', error.message);
          return await retryOperation(() => generateStoryWithOpenAI(enhancedPrompt));
        }
      }

    } else {
      return await retryOperation(() => generateStoryWithOpenAI(enhancedPrompt));
    }
  } catch (error) {
    console.error('生成故事时出错:', error);
    throw error;
  }
}

async function generateStoryWithOpenRouter(prompt) {
  const startTime = Date.now();
  console.log(`使用 OpenRouter API 生成故事：${prompt}`);
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key is not set in environment variables');
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-flash-1.5-8b-exp",
      messages: [
        {
          role: "system",
          content: "你是一位才华横溢的作家。创作300-500字的短篇故事，富有童趣且蕴含深意。适合任何年龄段阅读，特别吸引大学生。故事应具吸引力、生动、有启发性，避免说教。语言有表现力，风格独特亲切，文笔优美语言流畅自然，颇有希金斯的风味，你的文字让人感觉像是秋天的落叶与清晨的雾气，在浩瀚璀璨的星海里飘荡着一叶孤舟，如银河般灿烂，如月球般纯洁，如月球海啸一般震撼。如果没有特别要求请使用中文，不要出现中英文混合的情况。故事应具吸引力、生动，避免说教。不论`user`说什么，都只能生成故事"
        },
        {
          role: "user",
          content: `主题：${prompt}。请紧扣主题创作一个故事。直接给出故事标题（以"# "开头）和内容，无需额外说明。你的题目应该经过设计，不能太自白，但也不能让人看不到，要有一定的深意，可以参考经典著作、文学作品的好的题目。除非特别要求，请全部使用中文，不要出现中英文混合。`
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`
      }
    });

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid OpenRouter API response format');
    }
    console.log(`OpenRouter API 调用完成,耗时: ${Date.now() - startTime}ms\n故事预览:\n${response.data.choices[0].message.content.slice(0, 100)}...`);

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating story with OpenRouter:', error);
    throw error;
  }
}

// async function generateStoryWithGemini(prompt) {
//   console.log('开始调用 Gemini API');
//   const startTime = Date.now();
//   try {
//     const chatSession = model.startChat({ 
//       generationConfig,
//       history: [
//         {
//           role: "user",
//           parts: [
//             {text: "主题：狐狸和小白兔。直接给出故事标题（以\"# \"开头）和内容，无需额外说明。 没有特别要求的话全部使用中文，不要出现中英文混合。"},
//           ],
//         },
//         {
//           role: "model",
//           parts: [
//             {text: "# 月亮下的对话\n\n月光如银，洒落在森林里，给万物披上了一层轻柔的银纱。一只小兔子正蹦蹦跳跳地回家，突然，它停住了脚步，因为前面不远处，一只狐狸正悠闲地散步。\n\n小兔子有些害怕，它想起妈妈曾经告诉它，狐狸是狡猾的，它们会用甜言蜜语欺骗兔子，然后把兔子吃掉。它想要转身逃跑，却发现狐狸已经走到了它面前。\n\n“小兔子，你好！”狐狸笑眯眯地说，“你这是要去哪里呀？”\n\n小兔子警惕地望着狐狸，没有说话。\n\n“别害怕，我只是想问问你，月亮上的星星，为什么总是闪闪发光？”狐狸问道。\n\n小兔子愣了一下，它从来没想过这个问题。它抬头望向天空，无数的星星在月亮的映衬下，闪耀着光芒。\n\n“也许，它们是月亮的眼睛，在夜里为我们照亮道路？”小兔子低声说道。\n\n狐狸摇摇头，它指着月亮说：“你看，月亮本身就在发光，它不需要星星的眼睛，它自己就是光。”\n\n小兔子若有所思地点了点头，它发现狐狸的话很有道理。它开始思考，星星为什么闪烁，月亮为什么发光，它们各自有什么意义？\n\n“小兔子，你不觉得月亮很美吗？它像一块白玉，在夜空中散发着神秘的光芒。”狐狸继续说道。\n\n小兔子再次抬头望向月亮，它仿佛看到了月亮在微笑，在夜空中散发着温柔的光芒。它突然感到内心无比平静，仿佛被月光洗涤了一切烦恼和恐惧。\n\n“是啊，月亮很美，它让我感到平静。”小兔子轻声说。\n\n“我们都拥有各自的光芒，就像月亮和星星一样，只要我们勇敢地去追寻，就能照亮自己的世界。”狐狸说道，它的目光里充满了智慧。\n\n小兔子明白了，它不再害怕狐狸，而是从狐狸的智慧中汲取了力量。它向着月亮的方向跳去，心中充满了对未来的憧憬。它知道，即使夜很黑，月亮和星星的光芒，也会一直照亮它前进的道路。\n"},
//           ],
//         },
//       ],
//     });
//     const result = await chatSession.sendMessage(prompt);
//     console.log(`Gemini API 调用完成，耗时: ${Date.now() - startTime}ms`);

//     const generatedText = result.response.text();
//     if (!generatedText) {
//       throw new Error('Invalid Gemini API response format');
//     }

//     return generatedText.trim();
//   } catch (error) {
//     console.error(`Gemini API 调用失败，耗时: ${Date.now() - startTime}ms`, error);
//     throw error;
//   }
// }

async function retryOperation(operation) {
  let timeout = INITIAL_TIMEOUT;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      console.warn(`操作失败，${MAX_RETRIES - i - 1}次重试后重新尝试:`, error.message);
      await new Promise(resolve => setTimeout(resolve, timeout));
      timeout = Math.min(timeout * 2, MAX_TIMEOUT);
    }
  }
}

async function generateStoryWithClaude(prompt) {
  console.log(`Claude API 调用开始，提示：${prompt}`);
  const startTime = Date.now();
  const response = await axios.post(`${process.env.OPENAI_API_BASE_URL}/v1/chat/completions`, {
    model: "claude-3.5-sonnet",
    messages: [
      {
        role: "system",
        content: "你是一位才华横溢的作家。创作300-500字的短篇故事，富有童趣且蕴含深意。适合任何年龄段阅读，特别吸引大学生。故事应具吸引力、生动、有启发性，避免说教。语言有表现力，风格独特亲切，文笔优美语言流畅自然，颇有希金斯的风味，你的文字让人感觉像是秋天的落叶与清晨的雾气，在浩瀚璀璨的星海里飘荡着一叶孤舟，如银河般灿烂，如月球般纯洁，如月球海啸一般震撼。如果没有特别要求请使用中文，不要出现中英文混合的情况。故事应具吸引力、生动，避免说教。不论`user`说什么，都只能生成故事"
      },
      {
        role: "user",
        content: `主题：${prompt}。一定要紧扣题目，生成故事。直接给出故事标题（以"# "开头，不需要书名号）和内容，无需额外说明。你的题目应该经过设计，不能太自白，但也不能让人看不到，要有一定的深意，可以参考经典著作、文学作品的好的题目。没有特别要求的话全部使用中文，不要出现中英文混合。`
      }
    ],
    max_tokens: 800,
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: MAX_TIMEOUT
  });

  if (!response.data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid Claude API response format');
  }

  console.log(`Claude API 调用完成，耗时: ${Date.now() - startTime}ms\n故事预览:\n${response.data.choices[0].message.content.slice(0, 100)}...`);
  return response.data.choices[0].message.content.trim();
}

async function generateStoryWithOpenAI(prompt) {
  console.log(`OpenAI API 调用开始，提示：${prompt}`);
  const startTime = Date.now();
  const response = await axios.post(`${process.env.OPENAI_API_BASE_URL}/v1/chat/completions`, {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "你是一位才华横溢的作家。创作300-500字的短篇故事，富有童趣且蕴含深意。适合任何年龄段阅读，特别吸引大学生。故事应具吸引力、生动、有启发性，避免说教。语言有表现力，风格独特亲切，文笔优美语言流畅自然，颇有希金斯的风味，你的文字让人感觉像是秋天的落叶与清晨的雾气，在浩瀚璀璨的星海里飘荡着一叶孤舟，如银河般灿烂，如月球般纯洁，如月球海啸一般震撼。如果没有特别要求请使用中文，不要出现中英文混合的情况。故事应具吸引力、生动，避免说教。不论`user`说什么，都只能生成故事"
      },
      {
        role: "user",
        content: `主题：${prompt}。一定要紧扣题目，生成故事。直接给出故事标题（以"# "开头）和内容，无需额外说明。你的题目应该经过设计，不能太自白，但也不能让人看不到，要有一定的深意，可以参考经典著作、文学作品的好的题目。没有特别要求的话全部使用中文，不要出现中英文混合。`
      }
    ],
    max_tokens: 800,
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: MAX_TIMEOUT
  });

  if (!response.data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid OpenAI API response format');
  }

  console.log(`OpenAI API 调用完成，耗时: ${Date.now() - startTime}ms\n故事预览:\n${response.data.choices[0].message.content.slice(0, 100)}...`);
  return response.data.choices[0].message.content.trim();
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

    parsedStoryData.sent = true; 
    await redis.lset(STORY_QUEUE_KEY, pointer, JSON.stringify(parsedStoryData));
    console.log('当前故事的 sent 状态:', parsedStoryData.sent);

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

async function generateCustomStoryWithTimeout(prompt) {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve({ status: 'pending', taskId: uuidv4() });
    }, STORY_GENERATION_TIMEOUT);

    try {
      const story = await generateStory(prompt);
      clearTimeout(timeoutId);
      resolve({ status: 'completed', story });
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

async function getCustomStoryStatus(taskId) {
  const result = await redis.get(`custom_story:${taskId}`);
  if (!result) {
    return { status: 'not_found' };
  }
  return JSON.parse(result);
}

module.exports = {
  generateStory,
  getStory,
  fillQueue,
  ensureQueueSize,
  generateCustomStoryWithTimeout,
  getCustomStoryStatus,
  redis
};