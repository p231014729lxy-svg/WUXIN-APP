import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import bgmMusic from '../assets/audio/bgm.mp3';

const BackgroundAudio = () => {
  const audioRef = useRef(null);
  const { isMuted, volume, activePlayer } = useAudio();
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    // Only play if no exclusive player is active
    if (!activePlayer) {
        setShouldPlay(true);
    } else {
        setShouldPlay(false);
    }
  }, [activePlayer]);

  useEffect(() => {
    if (audioRef.current) {
      if (shouldPlay && !isMuted) {
        audioRef.current.play().catch(e => console.log("BGM Autoplay blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [shouldPlay, isMuted]);

  useEffect(() => {
    if (audioRef.current && Number.isFinite(volume)) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <audio
      ref={audioRef}
      src={bgmMusic}
      loop
      preload="auto"
      className="hidden"
    />
  );
};

export default BackgroundAudio;
