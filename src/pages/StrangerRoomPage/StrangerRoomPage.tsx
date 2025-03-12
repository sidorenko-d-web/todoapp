import { useParams } from 'react-router-dom';
import { useGetUserProfileInfoByIdQuery } from '../../redux';
import { useGetPushLineQuery } from '../../redux';
import s from './StrangerRoomPage.module.scss';
import { Loader, Room } from '../../components';
import { StrangerHeader } from '../../components/profile/StrangerHeader';

export const StrangerRoomPage = () => {
  const { profileId } = useParams();
  const { data: profile, isLoading: isUserLoading } = useGetUserProfileInfoByIdQuery(profileId || '');
  const { isLoading: isPushLineLoading } = useGetPushLineQuery();

  if (!profile || !profileId) return <Loader />;

  const isLoading = isUserLoading || isPushLineLoading;

  if (isLoading) return <Loader />;

  // TODO: Раскомментировать когда на бэке будет vip данные
  return (
    <main className={s.page}>
      <StrangerHeader />
      
      <Room mode="stranger" strangerId={profile.id} />
    </main>
  );
};
