import { Dispatch, FC, SetStateAction } from 'react';
import styles from './TabsNavigation.module.scss';
import clsx from 'clsx';

interface Props {
  tabs: string[];
  currentTab: string;
  onChange: Dispatch<SetStateAction<string>>;
  colorClass?: string;
}

const TabsNavigation: FC<Props> = ({ tabs, currentTab, onChange, colorClass }) => {
  return (
    <div className={clsx(styles.tabNav)}>
      {tabs.map((item, index) => {
        const handleClick = () => {
          onChange(item);
        };
        return (
          <button
            onClick={handleClick}
            className={item === currentTab ? styles[colorClass ?? 'tabItemSelectedWhite'] : styles.tabItem}
            key={item + '' + index}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
