# 狐狸与小白兔的故事工坊 🦊🐰

在这个数字化的童话世界里，每个人都能成为故事的创造者。无论你是需要一个温暖的床头故事，还是寻找创意的灵感，狐狸与小白兔都将为你编织独特的文字魔法。

![狐狸与小白兔的故事世界](https://kawaro-pics-1319771351.cos.ap-beijing.myqcloud.com/mac_obsidian_pics/202410072329907.webp)

## 缘起

狐狸与小白兔，这两个童话中的经典角色，代表着智慧与纯真的完美结合。选择它们作为项目名称，不仅唤起了我们对童年的美好回忆，也象征着我们的故事生成器能够创造出既机智又温馨的内容。在这里，每个故事都是一次跨越想象力边界的冒险。

## 特色功能

- 📚 生成原创、富有想象力的短篇故事
- 🎭 适合所有年龄段，特别是寻找心灵慰藉的大学生
- ✨ 支持自定义故事主题，激发你的创意
- 🌐 提供直观的网页界面和强大的 API 接口

## 如何使用

### 网页版

访问 [https://fox-and-rabbit.kawaro.space](https://fox-and-rabbit.kawaro.space) 开始你的故事之旅。

1. 点击"生成随机故事"，立即获得一个精彩纷呈的故事。
2. 选择"创作独特故事"，输入你的灵感，让我们为你量身定制一个独一无二的童话。

### API 调用

为开发者提供的简洁高效的 API：

#### 1. 随机故事 API

**Endpoint:** `GET https://fox-and-rabbit.kawaro.space/api/story`

Python 示例：
```python
import requests

response = requests.get("https://fox-and-rabbit.kawaro.space/api/story")
print(response.json())
```

curl 示例：
```bash
curl https://fox-and-rabbit.kawaro.space/api/story
```

#### 2. 自定义故事 API

**Endpoint:** `POST https://fox-and-rabbit.kawaro.space/api/custom-story`

Python 示例：
```python
import requests

url = "https://fox-and-rabbit.kawaro.space/api/custom-story"
data = {"prompt": "一个关于勇气的励志故事"}

response = requests.post(url, json=data)
print(response.json())
```

curl 示例：
```bash
curl -X POST https://fox-and-rabbit.kawaro.space/api/custom-story \
     -H "Content-Type: application/json" \
     -d '{"prompt": "一个关于勇气的励志故事"}'
```

## 部署指南

如果你希望部署自己的实例，请按照以下步骤操作：

1. 克隆代码仓库：
   ```
   git clone https://github.com/your-username/fox-and-rabbit.git
   ```

2. 安装所需依赖：
   ```
   cd fox-and-rabbit
   npm install
   ```

3. 环境配置：
   复制 `.env.example` 文件并重命名为 `.env`。填写所有必要的环境变量。

4. 本地开发：
   ```
   npm run dev
   ```

5. 生产环境部署：
   推荐使用 Vercel 进行部署。确保你的 Vercel 账户配置正确，并已安装 Vercel CLI。

   执行部署命令：
   ```
   vercel --prod
   ```

   或者使用 Vercel 的 GitHub 集成进行自动部署：
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fox-and-rabbit)

   注意：部署前请在 Vercel 项目设置中正确配置所有环境变量。

## 贡献指南

我们欢迎各种形式的贡献，无论是新功能开发、bug 修复，还是文档改进。你的参与将使这个项目变得更加完善。

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 致谢

感谢所有保持童心、热爱故事的你们。愿这个项目能为你的生活增添一抹童话的色彩，在繁忙的日常中带来一刻的轻松与欢愉。

---

项目由 Luwavic 打造 | 让我们共同探索故事的无限可能，在字里行间发现生活的美好 :)