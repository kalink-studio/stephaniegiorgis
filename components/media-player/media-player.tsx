'use client';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  MediaPlayer as MediaPlayerPrimitive,
  MediaProvider,
  Poster,
  VideoSrc,
} from '@vidstack/react';
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import { clsx } from 'clsx';

import { maxWidthVar, mediaPlayer } from './media-player.css';

interface MediaPlayerProps {
  poster?: {
    url?: string | null;
    alt?: string | null;
  } | null;
  src: VideoSrc[] | string;
  title?: string;
  ratio?: '16/9' | '4/3' | '1/1';
  className?: string;
  maxWidth?: string | null;
}

export const MediaPlayer = ({
  poster,
  src,
  title,
  ratio,
  className,
  maxWidth,
}: MediaPlayerProps) => {
  if (!src) {
    return null;
  }

  return (
    <MediaPlayerPrimitive
      title={title}
      src={src}
      poster={poster?.url || ''}
      playsInline
      crossOrigin
      aspectRatio={ratio}
      className={clsx(mediaPlayer, className)}
      style={
        (maxWidth &&
          assignInlineVars({
            [maxWidthVar]: maxWidth,
          })) ||
        {}
      }
    >
      <MediaProvider>
        <Poster
          className="vds-poster"
          src={poster?.url || ''}
          alt={poster?.alt || ''}
        />
      </MediaProvider>

      <DefaultAudioLayout
        icons={defaultLayoutIcons}
        style={{ borderRadius: '0', border: 'none' }}
      />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayerPrimitive>
  );
};
