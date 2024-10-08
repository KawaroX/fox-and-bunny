document.addEventListener('DOMContentLoaded', function() {
    const storyNotesContainer = document.querySelector('.story-notes-container');
    const storyNotes = document.querySelectorAll('.story-note');
    const storyNoteFull = document.querySelector('.story-note-full');
    const overlay = document.querySelector('.overlay');
    const closeButton = storyNoteFull.querySelector('.close-button');

    const stories = {
        1: {
            title: "#狐狸与小白兔的秘密花园",
            content: "在一个阳光明媚的早晨，森林里弥漫着清新的气息，狐狸和小白兔在他们的秘密花园里嬉戏。这个花园是他们的避风港，满是五彩斑斓的花朵和青草，而这些美丽的景色仿佛是他们友情的象征。\n\n小白兔总是好奇地问：“狐狸，你是怎样找到这个地方的？”狐狸微微一笑，眼中闪烁着智慧的光芒：“有一天，我走在这片森林中，听见了花朵们的低语，便跟着它们的声音，终于找到了这个秘密的地方。”\n\n小白兔眨了眨眼，似懂非懂。他们一起在花园中追逐，分享着彼此的梦想。小白兔希望能在月光下跳舞，狐狸则想成为一位无畏的探险者。然而，白兔时常感到不安，心中总是有个声音在说：“你注定是猎物，永远不能追逐梦想。”狐狸则用他温暖的尾巴轻轻碰了碰小白兔，鼓励道：“梦想的力量在于勇敢去追逐，而不是在于你是猎物还是猎手。”\n\n一天，森林里来了一个贪婪的猎人，他在寻找小白兔。小白兔惊恐不已，躲藏在花丛中，浑身颤抖。狐狸却镇定自若，他跑到猎人面前，用他的聪明和机智引开了猎人的注意。小白兔在远处偷偷地目睹这一切，心中对狐狸的敬佩与日俱增。\n\n猎人被狐狸的花招所迷惑，最终离开了花园。小白兔欢快地蹦了出来，激动地说：“谢谢你，狐狸！你真是我的英雄！”狐狸微微一笑，回答道：“有时，勇气并不是无畏，而是为朋友而战的决心。”\n\n时间流逝，狐狸和小白兔的友谊愈发坚定。在一个又一个春天与秋天的循环中，他们在花园里分享梦想，互相鼓励，收获了成长和勇气。小白兔开始相信，自己不仅仅是个猎物，而是有能力去追逐自己的舞蹈。狐狸则明白了，友谊的力量足以超越一切界限，甚至改变自身的命运。\n\n在这个秘密的花园里，他们的笑声回荡在空气中，像是花瓣飘落，轻盈而美丽。尽管森林依旧充满了挑战，但他们的心中，却种下了一颗勇气的种子，等待着每一个春天的到来。"
        },
        2: {
            title: "#风中的梦想",
            content: "校园里的大树下，一个男孩坐在草地上，手中捏着一张白纸。他的目光透过纸张，似乎在追寻着什么。几只小鸟在树枝间嬉戏，发出清脆的鸣叫声，仿佛在鼓励他。男孩微微一笑，脑海中浮现出自己一直以来的梦想：成为一名飞行员。\n\n他小心翼翼地将纸张折叠成一架纸飞机，心中默念着：“飞吧，带着我的梦想去探索世界。”随着一声轻轻的释放，纸飞机像一只自由的小鸟，迎着风，翱翔而去。男孩目送着它，脑海中回旋着无数的可能性。\n\n然而，纸飞机在空中翻滚，失去了方向，最终落在了草丛中。他的心中不禁升起一丝失落。就在这时，一个小女孩跑了过来，眼中闪烁着好奇的光芒。她捡起那架纸飞机，认真地打量着。\n\n“你在做什么？”她问，声音清脆如夏日的溪水。\n\n“我在飞我的梦想。”男孩回答，语气中透着无奈。\n\n小女孩歪着头，似懂非懂。“那我也想飞我的梦想。”她说着，开始折起一张新的纸，认真地模仿着男孩的动作。\n\n看着小女孩专注的神情，男孩的心情逐渐明朗。他突然意识到，梦想并不仅仅是个人的追求，更是一种传递与分享。于是，他向小女孩讲述了他的梦想，讲述那些飞行时的憧憬与期待。\n\n“谢谢你！”小女孩说，眼中闪烁着坚定的光芒。她将折好的纸飞机递给男孩，微笑着说：“那你也要替我飞呀！”\n\n男孩接过纸飞机，感受到了小女孩的纯真与勇气。他心中涌起一股暖流，仿佛那失落的梦想再次燃起了希望的火焰。他与小女孩一起，许下了心中的愿望，夹带着感恩与梦想，将纸飞机抛向天空。\n\n纸飞机在空中盘旋，带着他们的期待与希望，一路飞向未知的远方。大树在微风中轻轻摇曳，似乎在回应他们的梦想。\n\n在那一刻，男孩明白了：每一次的起飞，都需要勇气与感恩，而每一个梦想，也在他人的陪伴中，才得以真正地腾飞。"
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