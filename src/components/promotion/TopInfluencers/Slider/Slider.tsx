import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Slider.module.scss';

export const SliderSelect = () =>{
  const settings = {
    dots: false,
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
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {cards.map(card => (
          <div key={card.id} className={styles.cardWrapper}>
            <div className={styles.card}>
              <div className={styles.topRow}>
                <span className={styles.seat}>{card.seat}</span>
              </div>
              <div className={styles.middleRow}>
                {/*<span className={styles.smiley}>🙂</span>*/}
              </div>
              <div className={styles.bottomRow}>
                {/*{card.fire !== undefined && (*/}
                {/*   <div className={styles.fireIcon}>*/}
                {/*     <span>🔥</span>*/}
                {/*     <span>{card.fire}</span>*/}
                {/*   </div>*/}
                {/*)}*/}
                {card.vip && <div className={styles.vip}>VIP</div>}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}