/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-bunny
 */

document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('.scene');
    const sun = document.querySelector('.sun');
    const clouds = document.querySelectorAll('.cloud');
    const fox = document.querySelector('.fox');
    const bunny = document.querySelector('.bunny');

    // 太阳点击效果
    sun.addEventListener('click', (e) => {
        e.stopPropagation();
        scene.classList.add('bright');
        
        // 在动画结束时移除 bright 类
        setTimeout(() => {
            scene.classList.remove('bright');
        }, 2500);
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
    bunny.addEventListener('click', (e) => {
        e.stopPropagation();
        bunny.classList.add('jump');
        setTimeout(() => bunny.classList.remove('jump'), 1000);
    });
});