import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';

import s from './Slider.module.scss';

import lock from '../../../../assets/icons/lock-gray.svg';
import face from '../../../../assets/icons/face.svg';
import fire from '../../../../assets/icons/fire-icon.svg';
import { useGetTopProfilesQuery } from '../../../../redux';
import { Link } from 'react-router-dom';

type SliderProps = {
  isInfluencersLocked?: boolean
}

export const SliderSelect = ({ isInfluencersLocked }: SliderProps) => {
  const settings: Settings = {
    variableWidth: true,
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { data } = useGetTopProfilesQuery(undefined, { skip: isInfluencersLocked });
  const topProfiles = data?.profiles;

  if (!topProfiles && !isInfluencersLocked) return null;

  // TODO: Раскомментировать когда на бэке будет vip данные
  return (
    <div className={s.sliderContainer}>
      <Slider {...settings}>
        {
          isInfluencersLocked && Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={s.cardWrapper}
            >
              <div className={classNames(s.cardBlock, {/*{ [s.vipCard]: profile.vip }*/ })}>
                  <div className={s.infoRang}>
                    <span className={s.seat}>{'# ???'}</span>
                    { /*profile.fire true !== undefined &&*/ (
                      <div className={s.fireIcon}>
                        <img src={fire} alt="fire" />
                        <span>???</span>
                      </div>
                    )}
                  </div>
                  <div className={s.middleRow}>
                    <img src={lock} alt="Lock" />
                  </div>
                  {/*{profile.vip && (*/}
                  {/*  <div className={s.vip}>*/}
                  {/*    <img src={star} alt="star" />*/}
                  {/*    <span>VIP</span>*/}
                  {/*  </div>*/}
                  {/*)}*/}
              </div>
            </div>
          ))
        }

        {!isInfluencersLocked && topProfiles && topProfiles.map((profile, index) => (
          <Link
            draggable={false}
            to={`/profile/${profile.id}`}
            key={profile.id}
            className={s.cardWrapper}
          >
            <div className={classNames(s.cardBlock, {/*{ [s.vipCard]: profile.vip }*/ })}>
              <div className={s.card}>
                <div className={s.infoRang}>
                  <span className={s.seat}>{`# ${index + 1}`}</span>
                  { /*profile.fire true !== undefined &&*/ (
                    <div className={s.fireIcon}>
                      <img src={fire} alt="fire" />
                      <span>6</span>
                    </div>
                  )}
                </div>
                <div className={s.middleRow}>
                  <img src={face} alt="face" />
                </div>
                {/*{profile.vip && (*/}
                {/*  <div className={s.vip}>*/}
                {/*    <img src={star} alt="star" />*/}
                {/*    <span>VIP</span>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};
