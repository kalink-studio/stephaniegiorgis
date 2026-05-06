import { VideoSrc, VideoMimeType } from '@vidstack/react';

import { MediaPlayer } from '@/components/media-player';
import {
  getMediaAlt,
  getMediaUrl,
  videoRatioToSlash,
} from '@/payload/runtime/helpers';
import type { VideoBlock } from '@/payload/runtime/types';

import { videoWrapper } from './video-block.css';

interface Props {
  block: VideoBlock;
}

export function VideoBlockComponent({ block }: Props) {
  const mediaRatio = videoRatioToSlash(block.ratio);

  const src: VideoSrc[] = [];

  const av1Url = getMediaUrl(block.av1File);
  if (av1Url) {
    src.push({
      src: av1Url,
      type: 'video/mp4; codecs=av01.0.05M.08' as VideoMimeType,
      width: 1280,
      height: 720,
    });
  }

  const h264Url = getMediaUrl(block.h264File);
  if (h264Url) {
    src.push({
      src: h264Url,
      type: 'video/mp4; codecs=avc1.4D401E' as VideoMimeType,
      width: 1280,
      height: 720,
    });
  }

  return (
    <div className={videoWrapper({ ratio: mediaRatio })}>
      <MediaPlayer
        poster={
          block.poster
            ? {
                url: getMediaUrl(block.poster, block.ratio ?? '16_9') ?? '',
                alt: getMediaAlt(block.poster),
              }
            : undefined
        }
        ratio={mediaRatio}
        src={src}
        maxWidth={block.maxWidth}
      />
    </div>
  );
}
