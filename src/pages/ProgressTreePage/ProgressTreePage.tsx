import { useDispatch } from 'react-redux';
import { Tree } from '../../components';
import { TreeGuide } from '../../components/guide/TreeGuide/TreeGuide';
import { GUIDE_ITEMS } from '../../constants';
import { isGuideShown, setGuideShown } from '../../utils';
import { setHightlightTreeLevelStats } from '../../redux/slices/guideSlice';

export const ProgressTreePage = () => {

  const dispatch = useDispatch();

  return (
    <>
      <Tree/>

      {!isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && <TreeGuide onClose={() => {
        dispatch(setHightlightTreeLevelStats(false));
        setGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);
      }}/>}
    </>
  )
}
