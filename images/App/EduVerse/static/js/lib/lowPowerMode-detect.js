document.querySelectorAll('.js-video-bg').forEach((frame) => {
    const VIDEO = frame.querySelector('video');

    if (VIDEO.hasAttribute('loop') && VIDEO.hasAttribute('autoplay')) {
        VIDEO
            .play()
            .catch(() => {
                VIDEO.style.display = 'none';
            });
    }
});