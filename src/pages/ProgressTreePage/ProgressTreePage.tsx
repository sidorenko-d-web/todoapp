import { useState } from 'react';
import { Tree, TreeGuide } from '../../components';
import { GUIDE_ITEMS } from '../../constants';
import { isGuideShown, setGuideShown } from '../../utils';

export const ProgressTreePage = () => {

  const [_, setRerender] = useState(0);

  return (
    <>
      
      <Tree />
      {!isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && (
        <TreeGuide
          onClose={() => {
            setRerender((prev) => prev + 1);
            setGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);
          }}
        />
      )}
    </>
  );
};
