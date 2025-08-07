import { useEffect } from "react";
import { useAtomValue } from "jotai";
import {
  globalEmitterAtom,
  showCommunityPageAtom,
} from "../../../state/app.atoms";
import { Primitive } from "../../../state/types/primitive";

const Index = () => {
  const showCommunityPage = useAtomValue(showCommunityPageAtom);
  const emitSocketSignal = useAtomValue(globalEmitterAtom);
  useEffect(() => {
    emitSocketSignal?.(new Primitive("/"));
  }, [emitSocketSignal, showCommunityPage]);

  return <></>;
};

export default Index;
