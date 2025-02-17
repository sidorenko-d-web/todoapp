import { useDispatch } from 'react-redux';
import { Tree, TreeGuide } from '../../components';
import { GUIDE_ITEMS } from '../../constants';
import { isGuideShown, setGuideShown } from '../../utils';
import { useEffect } from 'react';
import { setActiveFooterItemId } from '../../redux';

export const ProgressTreePage = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFooterItemId(6));
  });

  
  return (
    <>
      <Tree/>
      {!isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && <TreeGuide onClose={() => {
        setGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);
      }}/>}
    </>
  )
}
