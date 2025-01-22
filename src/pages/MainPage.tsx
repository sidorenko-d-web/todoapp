import { FC } from 'react';

interface MainPageProps {

}

const MainPage: FC<MainPageProps> = ({}: MainPageProps) => {
  const text = 'MainPage component';

  return (
    <>
      <h2>{text}</h2>
    </>
  );
};

export default MainPage;