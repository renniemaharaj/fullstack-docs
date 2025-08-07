import { useAtomValue, useSetAtom } from "jotai";
import {
  globalEmitterAtom,
  showCommunityPageAtom,
} from "../../../state/app.atoms";
import { useEffect } from "react";
import { Primitive } from "../../../state/types/primitive";
import { useParams } from "react-router-dom";

const Community = ({ withID }: { withID?: boolean }) => {
  const setShowCommunityPage = useSetAtom(showCommunityPageAtom);
  const emitSocketSignal = useAtomValue(globalEmitterAtom);
  const params = useParams();
  useEffect(() => {
    setShowCommunityPage(true);
    if (withID && params.documentID) {
      const ID = parseInt(params.documentID);
      emitSocketSignal?.(
        new Primitive("/community").setBody(JSON.stringify({ id: ID }))
      );
    } else emitSocketSignal?.(new Primitive("/community"));
  }, [emitSocketSignal, params.documentID, setShowCommunityPage, withID]);

  return <></>;
};

export default Community;
