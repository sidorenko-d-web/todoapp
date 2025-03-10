import { useEffect, useState } from 'react';
import s from './Loader.module.scss';
import Lottie from 'lottie-react';
import { coinLoadingAnimation } from '../../assets/animations';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export type LoaderProps = {
  className?: string
  noMargin?: boolean
}

export const Loader = ({ className, noMargin }: LoaderProps) => {
  const [ dots, setDots ] = useState('');
  const { t } = useTranslation('quests');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={clsx(
      s.wrapper,
      {
        [s.noMargin]: noMargin,
      },
      className,
    )}>
      <Lottie
        animationData={coinLoadingAnimation}
        loop={true}
        autoplay={true}
        className={s.hand}
      />
      <span className={s.loading}>
        <span className={s.text}>{t('q16')}</span>
        <span className={s.dots}>{dots}</span>
      </span>
    </div>
  );
};
