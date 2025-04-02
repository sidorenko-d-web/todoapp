import { useEffect, useRef, useState } from 'react';

import bgAudio1 from '../assets/audio/Фон1.mp3';
import bgAudio2 from '../assets/audio/Фон2.mp3';
import bgAudio3 from '../assets/audio/Фон3.mp3';
import { selectTrack, selectVolume } from '../redux';
import { useSelector } from 'react-redux';

export const AudioBg = () => {
  const volume = useSelector(selectVolume);
  const track = useSelector(selectTrack);
  
  // Сохраняем текущую позицию воспроизведения
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Функция для воспроизведения аудио
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      setIsPlaying(true);
    }
  };
  
  // Отдельный эффект для обновления громкости
  // Это не вызовет перезапуск аудио
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);
  
  // Отдельный эффект для изменения трека
  // Этот эффект сохраняет текущее состояние воспроизведения
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Сохраняем текущее состояние
    const wasPlaying = !audioRef.current.paused;
    
    // Назначаем новый источник
    audioRef.current.src = track === 1 ? bgAudio1 : track === 2 ? bgAudio2 : bgAudio3;
    
    // Если аудио уже воспроизводилось, продолжаем воспроизведение
    if (wasPlaying) {
      audioRef.current.play().catch(e => console.log('Play prevented after track change:', e));
    }
  }, [track]);
  
  // Слушатель для сохранения текущей позиции
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Слушатель для автозапуска после взаимодействия пользователя
  useEffect(() => {
    document.addEventListener('click', playAudio);
    return () => {
      document.removeEventListener('click', playAudio);
    };
  }, []);

  return (
    <div style={{ display: 'none' }}>
      <audio autoPlay ref={audioRef} id={'audio'} loop />
    </div>
  );
};
