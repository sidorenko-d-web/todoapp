import { Dispatch, FC, SetStateAction } from 'react';
import styles from './TabsNavigation.module.scss';
import clsx from 'clsx';

interface Props {
  tabs: { title: string; value: string }[];
  currentTab: string;
  onChange: Dispatch<SetStateAction<{ title: string; value: string }>>;
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
            className={item.title === currentTab ? styles[colorClass ?? 'tabItemSelectedWhite'] : styles.tabItem}
            key={item + '' + index}
          >
            {item.title}
          </button>
        );
      })}
    </div>
  );
};

export default TabsNavigation;
