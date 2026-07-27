1. Замените файл:
src/components/blocks/Video/Video.astro

2. Добавьте файл субтитров:
public/videos/intro.vtt

3. На странице достаточно оставить:
<Video
  videoSrc="/videos/video.mp4"
  poster="/images/video-poster.webp"
/>

Компонент сам использует /videos/intro.vtt и показывает раскрывающийся SEO-текст под видео.
