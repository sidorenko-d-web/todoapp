import { useEffect } from 'react';
import WebApp from "@twa-dev/sdk";
import { useModal } from './useModal';
import { MODALS } from '../constants/modals';

export const useWebApp = () => {
  const { getModalState, openModal } = useModal();
  const { isOpen } = getModalState(MODALS.SETTINGS);

  useEffect(() => {
    WebApp.ready();
    WebApp.SettingsButton.show();

    const handleSettingsClick = () => {
      // TODO: не забыть расскоментить и при запуске проекта
      // WebApp.SettingsButton.hide();
      // openModal(MODALS.SETTINGS);

      localStorage.clear()
    };

    WebApp.SettingsButton.onClick(handleSettingsClick);
    return () => {
      WebApp.SettingsButton.offClick(handleSettingsClick);
    };
  }, [openModal]);

  useEffect(() => {
    isOpen ? WebApp.SettingsButton.hide() : WebApp.SettingsButton.show();
  }, [isOpen]);
}