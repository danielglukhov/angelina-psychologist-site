1. Замените файл:
src/components/blocks/Video/Video.astro

2. Добавьте файл субтитров:
public/videos/intro.vtt

3. На странице достаточно оставить:
<Video
  videoSrc="https://pub-b2802ad1bb364c4bb4669b666012b25f.r2.dev/video.mp4"
/>

Компонент сам использует /videos/intro.vtt и показывает раскрывающийся SEO-текст под видео.
