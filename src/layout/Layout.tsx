import { Footer } from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import { Header } from '../components/Header/';

const Layout = () => {
  const location = useLocation();

  const showHeader = !location.pathname.match(/^\/profile\/[0-9a-fA-F-]{36}$/);

  return (
    <div className={styles.wrp}>
      {showHeader && <Header />}
      <main className={styles.content + ' ' + (showHeader ? styles.withHeader : '')}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;