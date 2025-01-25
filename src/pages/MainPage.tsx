import { FC } from 'react';
import { Link } from 'react-router-dom';

interface MainPageProps {

}

const MainPage: FC<MainPageProps> = ({}: MainPageProps) => {
  const text = 'MainPage component';

  return (
    <>
      <h2>{text}</h2>
      <Link to={'/tasks'}>Tasks</Link>
      <Link to={'/promotion'}>Promotion</Link>
    </>
  );
};

export default MainPage;