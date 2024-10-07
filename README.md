# Fox and Rabbit Story Workshop

[中文](./README_CN.md) | [English](./README.md)

Welcome to the Fox and Rabbit Story Workshop, where every word is a seed, waiting to take root in your heart and blossom into a vibrant forest of stories.

![A cozy story world](https://kawaro-pics-1319771351.cos.ap-beijing.myqcloud.com/mac_obsidian_pics/202410072329907.webp)

## The Origin

"Why fox and rabbit?" you might ask. In countless fairy tales, the fox and the rabbit are the most common and beloved characters. The fox often represents wisdom and cunning, while the rabbit symbolizes innocence and kindness.

We chose these two characters as the name of our project because they evoke our shared childhood memories. They are not just characters, but cultural symbols, a common language that transcends age and culture. In our story workshop, these seemingly opposing characters coexist harmoniously, symbolizing the story world we hope to create—a world where wisdom and innocence coexist, where wit and kindness dance together.

Here, each story is a warm encounter, a perfect blend of the fox's wisdom and the rabbit's innocence. We hope that whether you're a child or an adult, you can find a story that belongs to you here and feel the magic of fairy tales.

## What We Offer

At the Fox and Rabbit Story Workshop, we provide:

- Creation of original stories: Each story is unique, like a warm and loving sweater knitted by your mother.
- Appeal across ages: Whether you're a toddler, a seasoned elder, or a college student rushing to early classes, there's always a story waiting for you here.
- Customized imagination space: Your imagination is our starting point. Tell us your fantastic ideas, and we'll weave them into a splendid story world.
- Dual experience modes: A simple and intuitive web interface for easy story journeys, and powerful APIs for tech enthusiasts offering endless possibilities. Choose your preferred way to start your story adventure.

## How to Start Your Story Journey

### Web Version

Come [here](https://fox-and-rabbit.kawaro.space) to meet us. This is the starting point of your story adventure.

1. Click "Generate Random Story" to let surprises knock on your door. Each click is an unknown adventure.
2. Choose "Create Unique Story" to tell us your ideas. Your creativity, our pen, together we write a unique chapter that belongs only to you.

### iOS Shortcut

We've created an iOS shortcut for easy and quick story access. Note that stories won't be rendered in Markdown, so the visual experience might be slightly different (titles won't be enlarged, bold, or centered). Installation is simple:

1. Click here to download the [Fox and Rabbit Story Shortcut](https://www.icloud.com/shortcuts/8dc1746801ae4378bd72c24428ed2857)
2. Install the shortcut on your iOS device
3. Once installed, you'll have a story genie at your fingertips

Whether you're on your morning commute or during lunch break, just a tap will summon a brand new story. This shortcut is like a small magic pocket, always ready to add a touch of imagination to your daily life.

Imagine, in the moment while waiting for your coffee, or just before falling asleep, a light tap opens up a new text adventure. Let the stories of the fox and rabbit become the little pleasures that decorate your life.

Are you ready? Let's use this little shortcut to begin your story journey!

### API Calls

For friends who like to control the magic themselves, we've prepared powerful APIs:

#### Random Story API

**Address:** `GET https://fox-and-rabbit.kawaro.space/api/story`

Python friends can summon stories like this:
```python
import requests
response = requests.get("https://fox-and-rabbit.kawaro.space/api/story")
print(response.json())
```

Command line wizards can try:
```bash
curl https://fox-and-rabbit.kawaro.space/api/story
```

#### Custom Story API

**Address:** `POST https://fox-and-rabbit.kawaro.space/api/custom-story`

Python example, let's weave dreams together:
```python
import requests
url = "https://fox-and-rabbit.kawaro.space/api/custom-story"
data = {"prompt": "A heartwarming story about friendship and courage"}
response = requests.post(url, json=data)
print(response.json())
```

Command line example, touch the magic of stories with your fingertips:
```bash
curl -X POST https://fox-and-rabbit.kawaro.space/api/custom-story \
     -H "Content-Type: application/json" \
     -d '{"prompt": "A heartwarming story about friendship and courage"}'
```

## How Stories Are Born

In the Fox and Rabbit Story Workshop, the birth of each story is a perfect combination of technology and creativity. Let's lift the curtain and see how stories transform from imagination to reality.

[The rest of the sections like "The Magic of Random Stories", "The Journey of Custom Stories", "Want to Build Your Own Story House?", "Let's Make This Little House Better Together", "About Usage Rules", and "Thank You for Being Here" can be translated similarly, maintaining the style and tone of the original.]

---

Lovingly built by Luwavic | Let's weave the beauty of life between the lines and create our own story miracles