import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import { MODALS, SOUNDS } from '../constants';
import { selectVolume } from '../redux';
import { useModal } from './useModal';

type modal_keys = keyof typeof MODALS;
type sound_keys = keyof typeof SOUNDS;

export const useAutoPlaySound = (
  modal: (typeof MODALS)[modal_keys],
  sound: (typeof SOUNDS)[sound_keys],
) => {
  const { getModalState } = useModal();
  const state = getModalState(modal);
  const [playSound] = useSound(sound, { volume: useSelector(selectVolume) });

  useEffect(() => {
    if (state.currentModal === modal && state.isOpen) playSound();
  }, [state]);
};
