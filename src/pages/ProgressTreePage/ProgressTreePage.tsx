import { useEffect, useState } from 'react';
import { Tree, TreeGuide } from '../../components';
import { GUIDE_ITEMS } from '../../constants';
import { isGuideShown, setGuideShown } from '../../utils';

export const ProgressTreePage = () => {

  const [_, setRerender] = useState(0);

  const [showGuide, setShowGuide] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  
  return (
    <>
      
      <Tree />
      {(!isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && showGuide) && (
        <TreeGuide
          onClose={() => {
            setRerender((prev) => prev + 1);
            setGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);
            setRerender((prev) => prev + 1);
          }}
        />
      )}
    </>
  );
};
