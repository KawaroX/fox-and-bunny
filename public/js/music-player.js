/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-bunny
 */

document.addEventListener('DOMContentLoaded', function() {
    const audio = new Audio('../assets/mango_tea.mp3');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;
    let audioContext, source, gainNode;

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audio);
        gainNode = audioContext.createGain();
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    }

    function fadeIn(duration) {
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + duration);
    }

    function fadeOut(duration) {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    }

    function playSong() {
        if (!audioContext) initAudio();
        audio.play().then(() => {
            fadeIn(1);
            isPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('paused');
            console.log('Playing class added:', musicToggle.classList.contains('playing')); // 添加这行
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    function pauseSong() {
        fadeOut(1);
        setTimeout(() => {
            audio.pause();
            isPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('paused');
        }, 1000);
    }

    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // 使用 fetch API 实现流媒体
    fetch('../assets/mango_tea.mp3')
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            audio.src = url;
            audio.load();
        })
        .catch(error => console.error('Error loading audio:', error));

    // 循环播放
    audio.addEventListener('ended', function() {
        audio.currentTime = 0;
        playSong();
    });
});