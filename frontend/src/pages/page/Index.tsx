import Editor from "../../pkg/writer/Editor";
import { SplitPageLayout } from "@primer/react";
import { useEffect, useState } from "react";
import SubNavBar from "./SubNavBar";
import { Box } from "@primer/react-brand";
import SidePane from "./SidePane";
import useSocketSignals from "../../state/hooks/useSocketSignals";
import CreateFormDialog from "./forms/CreateDialog";
import { useAtomValue } from "jotai";
import { globalEmitterAtom } from "../../state/atoms/emitter.atom";
import { Primitive } from "../../state/types/primitive";
import { showCommunityPageAtom } from "../../state/app.atoms";
import Renderer from "../../pkg/writer/Renderer";
import { activeDocumentAtom } from "../../state/writer.atoms";

const Index = ({ onMountEmmit }: { onMountEmmit?: string }) => {
  const [paneCW] = useState([150, 250, 250]);
  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketSignals();
  const emitSocketSignal = useAtomValue(globalEmitterAtom);
  const activeDocument = useAtomValue(activeDocumentAtom);
  const showCommunityPage = useAtomValue(showCommunityPageAtom);

  useEffect(() => {
    if (onMountEmmit) emitSocketSignal?.(new Primitive(onMountEmmit));
    else emitSocketSignal?.(new Primitive("/"));
  }, [emitSocketSignal, onMountEmmit]);
  return (
    <Box>
      {/** Import side navbar*/}
      <SubNavBar />
      {/** Import create form dialog */}
      <CreateFormDialog />
      <SplitPageLayout>
        <SplitPageLayout.Pane
          position="start"
          className="!flex"
          padding="condensed"
          width={{
            min: `${paneCW[0]}px`,
            max: `${paneCW[1]}px`,
            default: `${paneCW[2]}px`,
          }}
        >
          {/** Import side pane */}
          <SidePane />
        </SplitPageLayout.Pane>
        <SplitPageLayout.Content>
          {showCommunityPage ? (
            <Renderer content={activeDocument?.content ?? ""} />
          ) : (
            <Editor />
          )}
        </SplitPageLayout.Content>
      </SplitPageLayout>
    </Box>
  );
};

export default Index;
