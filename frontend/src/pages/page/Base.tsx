import { useCallback, type ReactNode } from "react";
import SubNavBar from "./SubNavBar";
import { Box } from "@primer/react-brand";
import useSocketSignals from "../../state/hooks/useSocketSignals";
import CreateFormDialog from "./forms/CreateDialog";
import { useAtomValue } from "jotai";
import { activeDocumentAtom } from "../../state/writer.atoms";
import SidePane from "./SidePane";
import Renderer from "../../pkg/writer/Renderer";
import { showCommunityPageAtom } from "../../state/app.atoms";
import Editor from "../../pkg/writer/Editor";
import { FScreenLayout } from "./FScreenLayout";

const Base = ({ children }: { children?: ReactNode }) => {
  const activeDocument = useAtomValue(activeDocumentAtom);
  const showCommunityPage = useAtomValue(showCommunityPageAtom);
  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketSignals();

  const pageContent = useCallback(() => {
    return showCommunityPage ? (
      <Renderer content={activeDocument?.content ?? ""} />
    ) : (
      <Editor />
    );
  }, [activeDocument?.content, showCommunityPage]);

  return (
    <Box>
      {/** Import create form dialog */}
      <CreateFormDialog />
      {/** Children (Do not pass actual react nodes)*/}
      {children}
      {/* <SplitPageLayout> */}
      <FScreenLayout
        header={<SubNavBar />}
        side={<SidePane />}
        content={pageContent()}
      />
    </Box>
  );
};

export default Base;
