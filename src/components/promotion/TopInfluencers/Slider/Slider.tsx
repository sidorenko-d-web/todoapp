import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classNames from 'classnames';

import s from './Slider.module.scss';

import face from '../../../../assets/icons/face.svg';
import fire from '../../../../assets/icons/fire.svg';
import star from '../../../../assets/icons/star.svg';

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
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3.5,
        },
      },
    ],
  };

  const cards = [
    {
      id: 1,
      seat: '#10 00',
      vip: true,
      fire: 12,
    },
    {
      id: 2,
      seat: '#2',
      vip: true,
      fire: 12,
    },
    {
      id: 3,
      seat: '#3',
      vip: false,
      fire: 12,
    },
    {
      id: 4,
      seat: '#4',
      vip: false,
      fire: 12,
    },
  ];

  return (
    <div className={s.sliderContainer}>
      <Slider {...settings}>
        {cards.map(card => (
          <div
            key={card.id}
            className={s.cardWrapper}
          >
            <div className={classNames(s.cardBlock, {[s.vipCard]: card.vip})}>
              <div className={s.card}>
                <div className={s.infoRang}>
                  <span className={s.seat}>{card.seat}</span>
                  {card.fire !== undefined && (
                    <div className={s.fireIcon}>
                      <img src={fire} alt="fire" />
                      <span>{card.fire}</span>
                    </div>
                  )}
              </div>
                <div className={s.middleRow}>
                  <img src={face} alt="face" />
              </div>
                {card.vip && (
                  <div className={s.vip}>
                    <img src={star} alt="star" />
                    <span>VIP</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
