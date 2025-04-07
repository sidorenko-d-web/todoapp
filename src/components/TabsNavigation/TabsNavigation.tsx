import { FC } from 'react';
import styles from './TabsNavigation.module.scss';
import clsx from 'clsx';
import { Button } from '../shared';
import { isGuideShown } from '../../utils';
import { GUIDE_ITEMS } from '../../constants';

interface Props {
  tabs: { title: string; value: string }[];
  currentTab: string | undefined;
  onChange: (item: { title: string; value: string }) => void;
  colorClass?: string;
}

const TabsNavigation: FC<Props> = ({ tabs, currentTab, onChange, colorClass }) => {
  return (
    <div className={clsx(styles.tabNav)}>
      {tabs.map((item, index) => {
        const handleClick = () => {
          if (isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)) {
            onChange(item);
          }
        };
        return (
          <Button
            onClick={handleClick}
            className={item.title === currentTab ? styles[colorClass ?? 'tabItemSelectedWhite'] : styles.tabItem}
            key={item + '' + index}
          >
            {item.title}
          </Button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
