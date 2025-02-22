import { useEffect, useRef } from 'react';

import bgAudio1 from '../assets/audio/Фон1.mp3';
import bgAudio2 from '../assets/audio/Фон2.mp3';
import bgAudio3 from '../assets/audio/Фон3.mp3';
import { selectTrack, selectVolume } from '../redux';
import { useSelector } from 'react-redux';

export const AudioBg = () => {
  const volume = useSelector(selectVolume);
  const track = useSelector(selectTrack);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.src = track === 1 ? bgAudio1 : track === 2 ? bgAudio2 : bgAudio3;
  }, [volume, track]);

  useEffect(() => {
    document.addEventListener('click', () => playAudio());
    return () => {
      document.removeEventListener('click', () => playAudio());
    };
  }, []);

  return (
    <iframe src={bgAudio1} allow="autoplay" id="audio" style={{ display: 'none' }}>
      <audio ref={audioRef} id={'audio'} loop>
        <source src={bgAudio1} type="audio/mp3" />
      </audio>
    </iframe>
  );
};
