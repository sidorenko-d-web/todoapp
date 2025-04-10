import { useCallback, useState } from 'react';
import { useUpdateTimeLeftMutation } from '../redux';

interface UseAccelerateIntegrationProps {
  integrationId: string;
  onSuccess: (newTimeLeft: number) => void;
}

export const useAccelerateIntegration = ({ integrationId, onSuccess }: UseAccelerateIntegrationProps) => {
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [updateTimeLeft] = useUpdateTimeLeftMutation();

  const accelerateIntegration = useCallback(async () => {
    setIsAccelerating(true);
    try {
      const response = await updateTimeLeft(integrationId).unwrap();
      onSuccess(response.time_left);
    } catch (error) {
      console.error('Ошибка ускорения интеграции:', error);
    } finally {
      setIsAccelerating(false);
    }
  }, [integrationId, onSuccess, updateTimeLeft]);

  return { accelerateIntegration, isAccelerating };
};
