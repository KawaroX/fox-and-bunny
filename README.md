# Fox and Rabbit Story Workshop

[中文](./README_CN.md) | [English](./README.md)

Welcome to the Fox and Rabbit Story Workshop. Here, every word is a seed waiting to take root and bloom into a vibrant forest of stories in your heart.

![Warm Story World](https://kawaro-pics-1319771351.cos.ap-beijing.myqcloud.com/mac_obsidian_pics/202410090216012.webp)

![Warm Story World](https://kawaro-pics-1319771351.cos.ap-beijing.myqcloud.com/mac_obsidian_pics/202410090216012.webp)

## Origins

"Why Fox and Rabbit?" you might ask. In countless fairy tales, foxes and bunnys are two of the most familiar and beloved characters. The fox often represents cunning and wit, while the bunny symbolizes innocence and kindness.

We chose these two characters as the name of our project because they evoke shared childhood memories. They are not just characters; they are cultural symbols, a universal language that transcends age and culture. In our story workshop, these seemingly opposing characters coexist harmoniously, symbolizing the world we hope to create—a world where wisdom and innocence, cleverness and kindness, dance together.

Here, every story is a warm encounter, a perfect blend of the fox's wit and the bunny's purity. We hope that both children and adults can find their own story here and feel the magic of fairy tales.

## What We Offer

In the Fox and Rabbit Story Workshop, we offer:

- **Original Story Creation**: Each story is unique, like a sweater lovingly knit by your mom, warm and full of love.
- **Ageless Appeal**: Whether you're a toddler learning to walk, a seasoned elder, ***or a college student facing early morning classes***, there’s always a story here waiting for you.
- **Custom Imagination Spaces**: Your imagination is our starting point. Share your ideas, and we'll weave them into a stunning world of stories.
- **Dual Experience Modes**: A simple and intuitive web interface to kickstart your story journey, or a powerful API that offers unlimited possibilities for tech enthusiasts. Choose your preferred way to begin your adventure.

## How to Start Your Story Journey

### Web Version

Come meet us [here](https://fox-and-bunny.kawaro.space). This is the starting point of your story adventure.

1. Click on "Generate Random Story" and let surprise knock on your door. Every click is an unknown adventure.
2. Choose "Create Unique Story" and tell us your ideas. Your creativity, our pen—together, we’ll write a chapter just for you.

### iOS Shortcut

I’ve created a shortcut that lets you quickly and easily get a story, although the story won’t be rendered in markdown, so the experience may be a little less polished (for example, the titles won’t be bold or centered). The installation process is very simple:

1. Click here to download the [Fox and Rabbit Story Shortcut](https://www.icloud.com/shortcuts/8dc1746801ae4378bd72c24428ed2857).
2. Install this shortcut on your iOS device.
3. After installation, you’ll have a portable story genie at your fingertips.

Whether you’re on your morning commute or enjoying a midday break, just tap once to summon a brand-new story. This shortcut is like a little magic pocket, always ready to add a splash of imagination to your daily life.

Imagine this: while waiting for your coffee, or right before bed, a simple tap opens the door to a new adventure in words. Let the stories of the fox and bunny be the small joys that brighten your life.

Ready? Let’s use this tiny shortcut to embark on your story journey!

### API Calls

For those who prefer to control the magic themselves, we offer a powerful API:

#### Random Story API

**URL:** `GET https://fox-and-bunny.kawaro.space/api/story`

Here's how Python enthusiasts can summon a story:
```python
import requests
response = requests.get("https://fox-and-bunny.kawaro.space/api/story")
print(response.json())
```

For command line wizards, try:
```bash
curl https://fox-and-bunny.kawaro.space/api/story
```

#### Custom Story API

**URL:** `POST https://fox-and-bunny.kawaro.space/api/custom-story`

Python example—let’s weave dreams together:
```python
import requests
url = "https://fox-and-bunny.kawaro.space/api/custom-story"
data = {"prompt": "A heartwarming story about friendship and courage"}
response = requests.post(url, json=data)
print(response.json())
```

Command line example—touch the magic of stories with your fingertips:
```bash
curl -X POST https://fox-and-bunny.kawaro.space/api/custom-story \
     -H "Content-Type: application/json" \
     -d '{"prompt": "A heartwarming story about friendship and courage"}'
```

## How Stories Are Born

In the Fox and Rabbit Story Workshop, every story’s birth is a perfect fusion of technology and creativity. Let’s pull back the curtain and see how stories go from imagination to reality.

### The Magic of Random Stories

Random stories are like morning sunlight—just a tap and they’ll warm your heart. But behind this seemingly simple process lies a carefully crafted technical mechanism.

We use Redis as our story caching platform. When you click the "Generate Random Story" button, the following process happens in an instant:

1. Our server immediately retrieves a pre-generated story from the Redis cache queue. This process is lightning-fast, ensuring you receive the story immediately.
   
2. At the same time, we check the generation time of the story. If it exceeds a preset time limit (e.g., 24 hours), the system immediately triggers the task of generating a new story.
   
3. The newly generated story replaces the old one, ensuring that the cache queue always contains fresh content.

This mechanism ensures that every random story you receive is relatively new, while also responding to your request swiftly. It’s like having a tireless storyteller ready to tell you a captivating tale at any moment.

### The Journey of Custom Stories

Custom stories, on the other hand, take a more complex journey. When you enter your creative idea, our story generation algorithm begins its magical journey:

1. First, your input is analyzed by our natural language processing module to extract key words and themes.
   
2. Then, this information is fed into our AI model (based on the GPT architecture). The model draws inspiration from vast training data to construct the story framework.
   
3. Next, the model gradually generates the story content, including plot development and character dialogue. This process requires multiple iterations to ensure coherence and quality.
   
4. Finally, the generated content undergoes post-processing, including formatting adjustments and a final quality check.

The whole process may take a few seconds to tens of seconds, depending on the complexity of the story and current system load. Though slower than random stories, this process ensures every custom story is unique, tailored entirely to your ideas.

Whether it's the instant bloom of a random story or the carefully crafted tale of a custom fairytale, each word is infused with our passion for technology and creativity. We hope these stories will add a touch of brightness to your life, bringing a moment of peace and joy amidst the busyness of daily routines.

## Want to Build Your Own Story Haven?

If you'd like to create your own storytelling haven, follow these steps:

1. Bring the code home:
   ```
   git clone https://github.com/KawaroX/fox-and-bunny.git
   ```

2. Get the tools ready:
   ```
   cd fox-and-bunny
   npm install
   ```

3. Set up your environment:
   Rename `.env.example` to `.env` and fill in the required information.

4. Test the waters in your backyard:
   ```
   npm run dev
   ```

5. Get ready for more visitors:
   We recommend using Vercel. Make sure your Vercel account is set up, install the Vercel CLI, then:
   ```
   vercel --prod
   ```
   Or use Vercel's GitHub auto-deploy:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KawaroX/fox-and-bunny)

   Don’t forget to fill in all the environment variables in your Vercel project settings.

## Let’s Make This Workshop Even Better

Every idea is a precious seed. Whether it’s sprouting new features, tending the garden by fixing bugs, or trimming the instructions for clarity, your contributions help make this story workshop more robust and inviting. We look forward to your participation—let’s cultivate this imaginative garden together.

## Terms of Use

We follow the MIT license. This means you have great freedom to use, modify, and share this project. All terms and conditions are detailed in the [LICENSE](LICENSE) file. Please take some time to review it and understand how you can interact with this project.

## Thank You

Finally, we want to extend heartfelt thanks to every story-loving soul who keeps their inner child alive. Your curiosity and imagination breathe life into this project. Somewhere in the world, a story is always waiting for you, and we’re here to accompany you on that journey. Let’s sail together through the ocean of words, discovering the bright and shining moments in life.

---

Lovingly built by Luwavic | Let’s weave the beauty of life into words and create story miracles together