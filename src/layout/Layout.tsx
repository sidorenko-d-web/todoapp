import { FC } from 'react';
import { Footer } from '../components/Footer';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss'
import { Header } from '../components/Header/';

interface LayoutProps {

}

const Layout: FC<LayoutProps> = ({}: LayoutProps) => {


  return (
    <div className={styles.wrp}>
      <Header />
      <main className={styles.content}>
        <Outlet/>
      </main>
        <Footer/>
    </div>
  );
};

export default Layout;