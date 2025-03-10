import { useGetPushLineQuery } from '../redux'; // adjust the import path as needed

export const usePushLineStatus = () => {
  const { data: pushLineData } = useGetPushLineQuery();
  const in_streak = pushLineData?.current_status == "in_streak";
  return { pushLineData, in_streak};
};