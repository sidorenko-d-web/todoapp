import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';

import s from './Slider.module.scss';

import face from '../../../../assets/icons/face.svg';
import fire from '../../../../assets/icons/fire-icon.svg';
import { useGetTopProfilesQuery } from '../../../../redux/index.ts';
import { Link } from 'react-router-dom';

export const SliderSelect = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 3.5,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 2.5,
        },
      },
    ],
  };

  const { data } = useGetTopProfilesQuery();
  const topProfiles = data?.profiles;

  if (!topProfiles) return null

  // TODO: Раскомментировать когда на бэке будет vip данные
  return (
    <div className={s.sliderContainer}>
      <Slider {...settings}>
        {topProfiles.map(profile => (
          <Link
            draggable={false}
            to={`/profile/${profile.id}`}
            key={profile.id}
            className={s.cardWrapper}
          >
            <div className={classNames(s.cardBlock, {/*{ [s.vipCard]: profile.vip }*/ })}>
              <div className={s.card}>
                <div className={s.infoRang}>
                  <span className={s.seat}>#12</span>
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
