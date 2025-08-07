import { useState, type ReactNode } from "react";
import SubNavBar from "./SubNavBar";
import { Box } from "@primer/react-brand";
import useSocketSignals from "../../state/hooks/useSocketSignals";
import CreateFormDialog from "./forms/CreateDialog";
import { SplitPageLayout } from "@primer/react";
import { useAtomValue } from "jotai";
import { activeDocumentAtom } from "../../state/writer.atoms";
import SidePane from "./SidePane";
import Renderer from "../../pkg/writer/Renderer";
import { showCommunityPageAtom } from "../../state/app.atoms";
import Editor from "../../pkg/writer/Editor";

const Base = ({ children }: { children?: ReactNode }) => {
  const [paneCW] = useState([150, 250, 250]);
  const activeDocument = useAtomValue(activeDocumentAtom);
  const showCommunityPage = useAtomValue(showCommunityPageAtom);
  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketSignals();
  return (
    <Box>
      {/** Import side navbar*/}
      <SubNavBar />
      {/** Import create form dialog */}
      {/** Children (Do not pass actual react nodes)*/}
      {children}
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

export default Base;
