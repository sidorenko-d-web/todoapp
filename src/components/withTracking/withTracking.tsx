import { usePostEventMutation } from '../../redux';
import { ComponentType, MouseEvent as ReactMouseEvent } from 'react';

type TrackingData = {
  eventType: 'button' | 'login' | 'other';
  eventPlace: string;
};

type WithTrackingProps = {
  trackingData: TrackingData;
};

export function withTracking<P extends { onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void }>(
  Wrapped: ComponentType<P>,
) {
  return (props: P & WithTrackingProps) => {
    const [trackClickMutation] = usePostEventMutation();
    const { trackingData, ...rest } = props;

    const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
      trackClickMutation({
        event: trackingData.eventType,
        description: trackingData.eventPlace,
      });
      props.onClick?.(e);
    };

    return <Wrapped {...(rest as unknown as P)} onClick={handleClick} />;
  };
}
