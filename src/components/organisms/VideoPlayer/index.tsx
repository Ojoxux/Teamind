'use client';

import { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  HStack,
  useColorModeValue,
  AspectRatio,
  type BoxProps,
} from '@chakra-ui/react';
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiSettings,
} from 'react-icons/fi';
import { Text } from '@/components/atoms/Text';

export interface VideoPlayerProps extends BoxProps {
  src: string;
  title?: string;
  poster?: string;
  onVideoTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export const VideoPlayer = ({
  src,
  title,
  poster,
  onVideoTimeUpdate,
  onEnded,
  ...props
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const bgColor = useColorModeValue('blackAlpha.700', 'blackAlpha.800');

  // 時間のフォーマット（秒 → MM:SS）
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 再生/一時停止の切り替え
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // ミュート切り替え
  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // 音量変更
  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = value;
    setVolume(value);

    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // シーク（再生位置の変更）
  const handleSeek = (value: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // フルスクリーン切り替え
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  // 動画のメタデータ読み込み完了時
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
  };

  // 再生時間の更新
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    onVideoTimeUpdate?.(time);
  };

  // 動画終了時
  const handleEnded = () => {
    setIsPlaying(false);
    onEnded?.();
  };

  // コントロールの表示/非表示
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const playerElement = document.getElementById('video-player-container');
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMouseMove);
      playerElement.addEventListener('mouseleave', () => {
        if (isPlaying) {
          setShowControls(false);
        }
      });
    }

    return () => {
      clearTimeout(timeout);
      if (playerElement) {
        playerElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isPlaying]);

  return (
    <Box
      id="video-player-container"
      position="relative"
      borderRadius="md"
      overflow="hidden"
      {...props}
    >
      <AspectRatio ratio={16 / 9}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onClick={togglePlay}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              togglePlay();
            }
          }}
          tabIndex={0}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          style={{ width: '100%', height: '100%' }}
        >
          <track kind="captions" src="" label="字幕" />
        </video>
      </AspectRatio>

      {/* コントロールオーバーレイ */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg={bgColor}
        p={3}
        opacity={showControls ? 1 : 0}
        transition="opacity 0.3s"
      >
        {/* シークバー */}
        <Slider
          aria-label="シークバー"
          value={currentTime}
          min={0}
          max={duration}
          onChange={handleSeek}
          mb={2}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            label={formatTime(currentTime)}
            placement="top"
            isOpen={false}
            hasArrow
          >
            <SliderThumb />
          </Tooltip>
        </Slider>

        <Flex justify="space-between" align="center">
          <HStack spacing={2}>
            {/* 再生/一時停止ボタン */}
            <IconButton
              aria-label={isPlaying ? '一時停止' : '再生'}
              icon={isPlaying ? <FiPause /> : <FiPlay />}
              onClick={togglePlay}
              variant="ghost"
              color="white"
              size="sm"
            />

            {/* 音量コントロール */}
            <Flex align="center">
              <IconButton
                aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
                icon={isMuted ? <FiVolumeX /> : <FiVolume2 />}
                onClick={toggleMute}
                variant="ghost"
                color="white"
                size="sm"
              />
              <Box w="80px" ml={1}>
                <Slider
                  aria-label="音量"
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleVolumeChange}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </Flex>

            {/* 再生時間 */}
            <Text color="white" fontSize="sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </HStack>

          <HStack spacing={2}>
            {/* 設定ボタン */}
            <IconButton
              aria-label="設定"
              icon={<FiSettings />}
              variant="ghost"
              color="white"
              size="sm"
            />

            {/* フルスクリーンボタン */}
            <IconButton
              aria-label="フルスクリーン"
              icon={<FiMaximize />}
              onClick={toggleFullscreen}
              variant="ghost"
              color="white"
              size="sm"
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};
