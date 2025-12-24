import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3); // Global volume
  const [activePlayer, setActivePlayer] = useState(null); // 'bgm', 'sleep', 'white-noise', etc.

  const playExclusive = (playerId) => {
    setActivePlayer(playerId);
  };

  const stopExclusive = (playerId) => {
    if (activePlayer === playerId) {
      setActivePlayer(null);
    }
  };

  const setVolume = (val) => {
      if (Number.isFinite(val)) {
          setVolumeState(val);
      }
  };

  return (
    <AudioContext.Provider value={{
      isMuted,
      setIsMuted,
      volume,
      setVolume,
      activePlayer,
      playExclusive,
      stopExclusive
    }}>
      {children}
    </AudioContext.Provider>
  );
};
