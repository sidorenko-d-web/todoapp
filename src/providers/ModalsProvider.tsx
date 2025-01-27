import { createContext, useState } from 'react';

type ModalState<T extends Record<string, unknown> = Record<string, unknown>> = {
  isOpen: boolean;
  args: T | null;
};

type ModalsContextType = {
  openModal: <T extends Record<string, unknown>>(key: string, args?: T) => void;
  closeModal: (key: string) => void;
  getModalState: <T extends Record<string, unknown>>(key: string) => ModalState<T>;
};

export const ModalsContext = createContext<ModalsContextType>({} as ModalsContextType);

export const ModalsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [modalsRegistry, setModalsRegistry] = useState<Record<string, ModalState>>({});

  const openModal = <T extends Record<string, unknown>>(key: string, args: T | null = null): void =>
    setModalsRegistry(prevModalsRegistry => ({
      ...prevModalsRegistry,
      [key]: {
        isOpen: true,
        args,
      },
    }));

  const closeModal = (key: string): void =>
    setModalsRegistry(prevModalsRegistry => ({
      ...prevModalsRegistry,
      [key]: {
        isOpen: false,
        args: prevModalsRegistry[key]?.args || null,
      },
    }));

  const getModalState = <T extends Record<string, unknown>>(key: string): ModalState<T> =>
    (modalsRegistry[key] as ModalState<T>) || {
      isOpen: false,
      args: null,
    };

  const contextValue: ModalsContextType = {
    openModal,
    closeModal,
    getModalState,
  };

  return <ModalsContext.Provider value={contextValue}>{children}</ModalsContext.Provider>;
};
