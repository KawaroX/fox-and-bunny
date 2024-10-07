const storyElement = document.getElementById('story');
const storyContentElement = document.getElementById('storyContent');
const generateButton = document.getElementById('generateStory');
const toggleCustomButton = document.getElementById('toggleCustomStory');
const customStorySection = document.getElementById('customStorySection');
const customPromptInput = document.getElementById('customPrompt');
const generateCustomButton = document.getElementById('generateCustomStory');
const closeStoryButton = document.getElementById('closeStory');

async function fetchStory(url, method = 'GET', body = null) {
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
            // 如果返回taskId，则开始轮询任务状态
            await pollStoryStatus(data.taskId);
        } else if (data.story) {
            // 如果直接返回故事，则显示故事
            const formattedStory = data.story;
            loadingIndicator.classList.add('fadeOut');
            await new Promise(resolve => setTimeout(resolve, 500));
            storyContentElement.innerHTML = '';
            typeStory(formattedStory);
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
    const maxAttempts = 60; // 最多尝试60次，每次间隔1秒
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        const response = await fetch(`/api/custom-story/status/${taskId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
            typeStory(data.story);
            return;
        } else if (data.status === 'error') {
            throw new Error(data.message);
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
    }
    
    throw new Error("生成故事超时");
}

function typeStory(story) {
    const paragraphs = story.split('\n\n');
    let paragraphIndex = 0;
    let charIndex = 0;
    const delay = 15;

    storyContentElement.innerHTML = '';
    storyContentElement.classList.add('story-content');

    storyElement.style.height = '0px';

    function addNextCharacter() {
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
                setTimeout(addNextCharacter, delay);
            } else {
                paragraphIndex++;
                charIndex = 0;
                setTimeout(addNextCharacter, delay * 2);
            }
        } else {
            storyContentElement.classList.add('show');
            storyElement.style.height = (storyContentElement.offsetHeight + 60) + 'px';
        }
    }

    addNextCharacter();
}

generateButton.addEventListener('click', () => fetchStory('/api/story'));

toggleCustomButton.addEventListener('click', () => {
    customStorySection.classList.toggle('show');
});

generateCustomButton.addEventListener('click', () => {
    const prompt = customPromptInput.value;
    if (!prompt) {
        alert('请在草原上编织你的故事...');
        return;
    }
    fetchStory('/api/custom-story', 'POST', { prompt });
});

closeStoryButton.addEventListener('click', () => {
    storyElement.classList.add('hide');
    storyContentElement.innerHTML = '';
});