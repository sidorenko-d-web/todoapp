import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

interface LazyLottieProps {
  animationData: any;
}

const LazyLottie: React.FC<LazyLottieProps> = ({ animationData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 } 
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {isVisible && <Lottie animationData={animationData} loop autoplay  
        style={{width: '50px', height:'55px', zIndex: '1000'}} />}
    </div>
  );
};

export default LazyLottie;
