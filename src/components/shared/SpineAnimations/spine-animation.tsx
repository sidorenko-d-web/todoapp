import { SpinePlayer } from '@esotericsoftware/spine-player';
import { FC, useEffect, useState } from 'react';
import { TypeItemQuality } from '../../../redux';

interface Props {
  skin: TypeItemQuality;
  jsonUrl: string;
  atlasUrl: string;
  name: string;
}

const SpineAnimation: FC<Props> = ({ skin, jsonUrl, atlasUrl, name }) => {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender && process.env.NODE_ENV === 'development') {
      const proxyImageUrl = (url: string) =>
        url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

      new SpinePlayer(name, {
        preserveDrawingBuffer: true,
        jsonUrl: proxyImageUrl(jsonUrl),
        atlasUrl: proxyImageUrl(atlasUrl),
        skin: `тетрадь-${skin === 'base' ? 1 : skin === 'advanced' ? 2 : 3}`,
        showLoading: false,
        animations: ['тетрадь'],
        alpha: true,
      });
    } else {
      setFirstRender(false);
    }
  });

  return <div id={name} style={{ width: '100%', height: '100%', position: 'absolute', overflow: 'hidden' }} />;
};

export default SpineAnimation;
