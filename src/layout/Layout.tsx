import { FC } from 'react';
import { Footer } from '../components/Footer';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss'

interface LayoutProps {

}

const Layout: FC<LayoutProps> = ({}: LayoutProps) => {


  return (
    <div className={styles.wrp}>
      <main className={styles.content}>
        <Outlet/>
      </main>
      <footer className={styles.footer}>
        <Footer/>
      </footer>
    </div>
  );
};

export default Layout;