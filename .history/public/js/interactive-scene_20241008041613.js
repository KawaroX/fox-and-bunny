document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('.scene');
    const sun = document.querySelector('.sun');
    const clouds = document.querySelectorAll('.cloud');
    const fox = document.querySelector('.fox');
    const rabbit = document.querySelector('.rabbit');

    // 太阳点击效果
    sun.addEventListener('click', (e) => {
        e.stopPropagation();
        sun.style.transform = 'translateX(-50%) scale(1.2)';
        scene.classList.add('bright');
        setTimeout(() => {
            sun.style.transform = 'translateX(-50%) scale(1)';
            scene.classList.remove('bright');
        }, 500);
    });

    // 云朵点击效果
    clouds.forEach(cloud => {
        cloud.addEventListener('click', (e) => {
            e.stopPropagation();
            cloud.classList.add('bounce');
            setTimeout(() => cloud.classList.remove('bounce'), 500);
        });
    });

    // 狐狸点击效果
    fox.addEventListener('click', (e) => {
        e.stopPropagation();
        fox.classList.add('jump');
        setTimeout(() => fox.classList.remove('jump'), 500);
    });

    // 兔子点击效果
    rabbit.addEventListener('click', (e) => {
        e.stopPropagation();
        rabbit.classList.add('jump');
        setTimeout(() => rabbit.classList.remove('jump'), 1000);
    });

    // 其他功能（如生成故事、切换自定义故事部分等）的代码应该保持不变
});a