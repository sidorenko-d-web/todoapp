import { Tree, TreeGuide } from '../../components';
import { GUIDE_ITEMS } from '../../constants';
import { isGuideShown, setGuideShown } from '../../utils';

export const ProgressTreePage = () => {


  return (
    <>
      <Tree/>

      {!isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && <TreeGuide onClose={() => {
        setGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);
      }}/>}
    </>
  )
}
