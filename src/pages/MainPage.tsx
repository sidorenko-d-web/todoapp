import { FC } from 'react';
import { Footer } from '../components/Footer';

interface MainPageProps {

}

const MainPage: FC<MainPageProps> = ({}: MainPageProps) => {
  const text = 'MainPage component';

  return (
    <>
      <h2>{text}</h2>
      <Footer />
    </>
  );
};

export default MainPage;