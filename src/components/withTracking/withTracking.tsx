import { ComponentType } from 'react';
import { usePostEventMutation } from '../../redux';

type TrackingData = {
  eventType: 'button' | 'login' | 'other'
  eventPlace: string
};

type WithTrackingProps = {
  trackingData: TrackingData;
};

export const withTracking = <P extends { onClick?: (event: MouseEvent) => void }>(
  Component: ComponentType<P>,
) => {
  return ({ trackingData, ...props }: P & WithTrackingProps) => {
    const [ trackClickMutation ] = usePostEventMutation();

    const handleClick = (event: MouseEvent) => {
      if (trackingData) {
        trackClickMutation({
          event: trackingData.eventType,
          description: trackingData.eventPlace,
        });
      }

      props.onClick?.(event);
    };

    return <Component {...(props as unknown as P)} onClick={handleClick} />;
  };
};
