import { useEffect, useRef, useState } from 'react';
import bgAudio1 from '../assets/audio/Фон1.mp3';
import bgAudio2 from '../assets/audio/Фон2.mp3';
import bgAudio3 from '../assets/audio/Фон3.mp3';
import { selectTrack, selectVolume } from '../redux';
import { useSelector } from 'react-redux';

export const AudioBg = () => {
  const volume = useSelector(selectVolume);
  const track = useSelector(selectTrack);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Вычисляем ios устройство
  useEffect(() => {
    const userAgent = navigator.userAgent
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent)
    setIsIOS(isIOSDevice);
  }, []);

  // Иницифлизируем аудио контекст для ios
  const initializeAudio = () => {
    if (audioInitialized || !audioRef.current) return;

    try {
      // создаем аудио контекст
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      // Возобновляем аудио контекст (необходимо для iOS)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Создаем узел источника из аудио элемента
      if (!sourceNodeRef.current && audioRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      }
      
      // Создаем узел усиления для контроля громкости
      if (!gainNodeRef.current) { 
        gainNodeRef.current = audioContextRef.current.createGain();
         // Соединяем узлы: источник -> усиление -> назначение
        if (sourceNodeRef.current && gainNodeRef.current) {
          sourceNodeRef.current.connect(gainNodeRef.current);
        }
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
      
      // Устанавливаем начальную громкость
      updateVolume(volume);

      // начинаем проигрывать (если возможно)
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            console.log("Audio playback started successfully");
            setAudioInitialized(true);
          })
          .catch(err => {
            console.error("Audio playback failed:", err);
             // Если произошла ошибка, попробуем снова при следующем взаимодействии пользователя
          });
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  // Обновляем громкость через соответствующий канал в зависимости от платформы
  const updateVolume = (newVolume: number) => {
    if (isIOS) {
      // Для iOS используем узел усиления Web Audio API для более надежного контроля
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = newVolume;
        console.log("iOS: Set volume through gain node:", newVolume);
      }
    } else {
      // Для не-iOS используем стандартное свойство громкости аудио элемента
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
        console.log("Non-iOS: Set volume through audio element:", newVolume);
      }
    }
  };

  // Обрабатываем изменения громкости
  useEffect(() => {
    const isMusicEnabled = localStorage.getItem("musicEnabled") === "true";
    const effectiveVolume = isMusicEnabled ? volume : 0;
    
    if (audioInitialized) {
      updateVolume(effectiveVolume);
    }
  }, [volume, audioInitialized]);

  // Обрабатываем изменения треков
  useEffect(() => {
    if (!audioRef.current) return;

    // Получаем источник текущего трека
    const trackSource = track === 1 ? bgAudio1 : track === 2 ? bgAudio2 : bgAudio3;
    
    // Меняем только если источник отличается
    if (audioRef.current.src !== trackSource) {
      // Запоминаем, воспроизводилось ли аудио
      const wasPlaying = !audioRef.current.paused;
      
      // Устанавливаем новый источник
      audioRef.current.src = trackSource;
      
      // Возобновляем воспроизведение, если оно было активно
      if (wasPlaying && audioInitialized) {
        audioRef.current.play().catch(e => console.error("Play prevented after track change:", e));
      }
    }
  }, [track, audioInitialized]);

  // Настраиваем обработчики взаимодействия пользователя
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioInitialized) {
        console.log("User interaction detected, initializing audio");
        initializeAudio();
      }
    };

     // Добавляем слушатели для различных взаимодействий пользователя
    const interactions = ['click', 'touchstart', 'keydown'];
    interactions.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: false });
    });

    return () => {
      interactions.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [audioInitialized]);

  // Очищаем аудио контекст при размонтировании
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div style={{ display: 'none' }}>
      <audio ref={audioRef} id="audio" loop preload="auto" />
    </div>
  );
};