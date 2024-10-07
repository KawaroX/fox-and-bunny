document.addEventListener('DOMContentLoaded', function() {
    const storyNotesContainer = document.querySelector('.story-notes-container');
    const storyNotes = document.querySelectorAll('.story-note');
    const storyNoteFull = document.querySelector('.story-note-full');
    const overlay = document.querySelector('.overlay');
    const closeButton = storyNoteFull.querySelector('.close-button');

    const stories = {
        1: {
            title: "狐狸和兔子的友谊",
            content: "很久很久以前，在一片美丽的草原上，住着一只聪明的小狐狸和一只可爱的小白兔。他们虽然天性不同，但却成为了最好的朋友。每天，他们一起探索草原，分享彼此的秘密，互相帮助解决问题。他们的友谊证明，即使是最不可能的组合，也能成为最真挚的朋友。"
        },
        2: {
            title: "森林冒险",
            content: "小狐狸和小白兔决定探索森林深处的神秘地带。他们穿过茂密的树林，跨过湍急的小溪，攀爬陡峭的山坡。途中，他们遇到了许多困难，但通过合作和智慧，他们总能找到解决办法。这次冒险不仅让他们发现了森林的秘密，更加深了他们之间的友谊。"
        },
        3: {
            title: "About",
            content: "© 2024 狐狸与小白兔\n\n这是一个充满温暖和欢乐的故事集，由 Luwavic 倾情创作。每个故事都蕴含着友谊、勇气和智慧的力量。\n\n想要了解更多，或者参与到故事的创作中来？欢迎访问我们的 GitHub 仓库！",
            link: "https://github.com/KawaroX/fox-and-rabbit"
        }
    };

    let isExpanded = false;
    let isTransitioning = false;

    storyNotes.forEach((note, index) => {
        note.addEventListener('click', function(event) {
            event.stopPropagation();
            if (!isTransitioning) {
                if (!isExpanded) {
                    expandNotes();
                } else {
                    const storyId = this.getAttribute('data-story');
                    showFullStory(storyId);
                }
            }
        });
    });

    function expandNotes() {
        if (!isTransitioning) {
            isTransitioning = true;
            storyNotesContainer.classList.add('expanded');
            setTimeout(() => {
                isExpanded = true;
                isTransitioning = false;
            }, 500); // 与 CSS 过渡时间匹配
        }
    }

    function collapseNotes() {
        if (!isTransitioning) {
            isTransitioning = true;
            storyNotesContainer.classList.remove('expanded');
            setTimeout(() => {
                isExpanded = false;
                isTransitioning = false;
            }, 500); // 与 CSS 过渡时间匹配
        }
    }

    function showFullStory(storyId) {
        const story = stories[storyId];
        
        storyNoteFull.querySelector('h3').textContent = story.title;
        storyNoteFull.querySelector('p').textContent = story.content;
        
        if (story.link) {
            const link = document.createElement('a');
            link.href = story.link;
            link.textContent = "访问 GitHub";
            link.target = "_blank";
            storyNoteFull.querySelector('p').appendChild(document.createElement('br'));
            storyNoteFull.querySelector('p').appendChild(document.createElement('br'));
            storyNoteFull.querySelector('p').appendChild(link);
        }
        
        storyNoteFull.classList.add('show');
        overlay.classList.add('show');
    }

    function hideFullStory() {
        storyNoteFull.classList.remove('show');
        overlay.classList.remove('show');
    }

    closeButton.addEventListener('click', hideFullStory);
    overlay.addEventListener('click', hideFullStory);

    document.addEventListener('click', function(event) {
        if (isExpanded && !storyNotesContainer.contains(event.target) && !isTransitioning) {
            collapseNotes();
        }
    });
});