import { SpinePlayer } from '@esotericsoftware/spine-player';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { svgHeadersString } from './constants';

const SpineAnimation = () => {
  const [added, setAdded] = useState(false);

  useLayoutEffect(() => {
    if (added) return;
    setAdded(true);
    console.log('a');

    const proxyImageUrl = (url: string) =>
      url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

    const spinePlayer = new SpinePlayer('spine', {
      preserveDrawingBuffer: true,
      jsonUrl: proxyImageUrl(
        'https://storage.yandexcloud.net/miniapp-v2-dev/Камера любительская-1.json',
      ),
      atlasUrl: proxyImageUrl(
        'https://storage.yandexcloud.net/miniapp-v2-dev/Камера любительская-1atlas.txt',
      ),
      skin: 'Камера любительская-1',
    });
  });

  return (
    <div style={{ marginTop: 100 }}>
      <div id="spine" style={{ width: '100%', aspectRatio: 1 }}></div>
    </div>
  );
};

export default SpineAnimation;
