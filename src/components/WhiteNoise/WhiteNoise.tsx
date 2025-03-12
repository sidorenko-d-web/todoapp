import React, { useEffect, useRef } from 'react';

const WhiteNoiseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return; 

    let width: number = window.innerWidth * 0.5;
    let height: number = window.innerHeight * 0.5;

    const updateDimension = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const setPixel = (imageData: ImageData, x: number, y: number, r: number, g: number, b: number, a: number) => {
      const index = (x + y * imageData.width) * 4;
      imageData.data[index + 0] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    };

    const draw = () => {
      const imageData = ctx.createImageData(width, height);
      const length = Math.floor((width * height) / 1);

      for (let i = 0; i < length; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);

        const gray = Math.floor(Math.random() * 5);
        setPixel(imageData, x, y, gray, gray, gray, 255); 
      }

      ctx.putImageData(imageData, 0, 0);
    };

    let lastTime = 0;
    const frameRate = 15; 
    const frameInterval = 1000 / frameRate;

    const animate = (time: number) => {
      if (time - lastTime >= frameInterval) {
        lastTime = time;
        updateDimension();
        draw();
      }
      requestAnimationFrame(animate);
    };

    animate(1);

    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', 
        zIndex: 20000,
        opacity: 0.12,
      }}
    />
  );
};

export default WhiteNoiseCanvas;