import { useSetAtom } from "jotai";
import Index from "../Index";
import { showCommunityPageAtom } from "../../../state/app.atoms";
import { useEffect } from "react";

const Community = () => {
  const setShowCommunityPage = useSetAtom(showCommunityPageAtom);

  useEffect(() => {
    setShowCommunityPage(true);
  }, [setShowCommunityPage]);
  return (
    <>
      {/** Import create form dialog */}
      <Index onMountEmmit="/community" />
    </>
  );
};

export default Community;
