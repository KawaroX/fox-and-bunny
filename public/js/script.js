/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-rabbit
 */

console.log("%c致从前一位朋友：这个项目的灵感和名字都来源于当时的聊天，希望你能喜欢，以及天天开心 :) 🦊🐰", "color: #FF6A88; font-style: italic; font-size: 14px;");

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

let isTyping = false;
let typingTimeout;

const storyElement = document.getElementById('story');
const storyContentElement = document.getElementById('storyContent');
const generateButton = document.getElementById('generateStory');
const toggleCustomButton = document.getElementById('toggleCustomStory');
const customStorySection = document.getElementById('customStorySection');
const customPromptInput = document.getElementById('customPrompt');
const generateCustomButton = document.getElementById('generateCustomStory');
const closeStoryButton = document.getElementById('closeStory');

async function fetchStory(url, method = 'GET', body = null) {
    if (isTyping) {
        stopTyping();
    }

    storyElement.classList.remove('error');
    storyElement.classList.remove('hide');
    storyElement.classList.add('show');
    storyContentElement.innerHTML = '<div id="loadingIndicator" class="loading">正在编织故事，请稍候</div>';
    const loadingIndicator = document.getElementById('loadingIndicator');

    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.taskId) {
            await pollStoryStatus(data.taskId);
        } else if (data.story) {
            loadingIndicator.classList.add('fadeOut');
            await new Promise(resolve => setTimeout(resolve, 500));
            storyContentElement.innerHTML = '';
            typeStory(data.story);
        } else {
            throw new Error("返回的数据中没有故事或任务ID");
        }
    } catch (error) {
        console.error('获取故事时出错:', error);
        storyContentElement.innerHTML = '<p class="error">夕阳西下，故事消散了...请再次尝试编织你的故事。</p>';
        storyElement.classList.add('error');
    }
}

async function pollStoryStatus(taskId) {
    const maxAttempts = 60;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        const response = await fetch(`/api/custom-story/status/${taskId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
            typeStory(data.story);
            return;
        } else if (data.status === 'error') {
            throw new Error(data.message || "生成故事时发生错误");
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error("生成故事超时");
}

function stopTyping() {
    isTyping = false;
    clearTimeout(typingTimeout);
    storyContentElement.classList.remove('show');
}

function typeStory(story) {
    const paragraphs = story.split('\n\n');
    let paragraphIndex = 0;
    let charIndex = 0;
    const delay = 15;

    storyContentElement.innerHTML = '';
    storyContentElement.classList.add('story-content');

    storyElement.style.height = '0px';
    isTyping = true;

    function addNextCharacter() {
        if (!isTyping) return;

        if (paragraphIndex < paragraphs.length) {
            const paragraph = paragraphs[paragraphIndex];
            
            if (charIndex === 0) {
                const isHeading = paragraph.startsWith('#');
                const element = document.createElement(isHeading ? 'h2' : 'p');
                storyContentElement.appendChild(element);
            }

            if (charIndex < paragraph.length) {
                const char = paragraph[charIndex];
                const currentElement = storyContentElement.lastElementChild;
                
                const span = document.createElement('span');
                span.textContent = char;
                span.style.opacity = '0';
                span.style.transition = 'opacity 0.4s ease-in-out';
                currentElement.appendChild(span);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                }, 20);

                storyElement.style.height = (storyContentElement.offsetHeight + 60) + 'px';
                
                charIndex++;
                typingTimeout = setTimeout(addNextCharacter, delay);
            } else {
                paragraphIndex++;
                charIndex = 0;
                typingTimeout = setTimeout(addNextCharacter, delay * 2);
            }
        } else {
            storyContentElement.classList.add('show');
            storyElement.style.height = (storyContentElement.offsetHeight + 60) + 'px';
            isTyping = false;
        }
    }

    addNextCharacter();
}

const debouncedFetchStory = debounce(fetchStory, 300);

// 修改事件监听器，使用防抖版本的 fetchStory
generateButton.addEventListener('click', () => debouncedFetchStory('/api/story'));

generateCustomButton.addEventListener('click', () => {
    const prompt = customPromptInput.value;
    if (!prompt) {
        alert('请在草原上编织你的故事...');
        return;
    }
    debouncedFetchStory('/api/custom-story', 'POST', { prompt });
});

toggleCustomButton.addEventListener('click', () => {
    customStorySection.classList.toggle('show');
});

closeStoryButton.addEventListener('click', () => {
    stopTyping();
    storyElement.classList.add('hide');
    storyContentElement.innerHTML = '';
});