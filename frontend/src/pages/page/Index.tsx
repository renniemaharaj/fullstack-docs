import Editor from "../../pkg/writer/Editor";
import { SplitPageLayout } from "@primer/react";
import { useState } from "react";
import SubNavBar from "./SubNavBar";
import { Box } from "@primer/react-brand";
import SidePane from "./SidePane";
import useBackendSocket from "../../state/hooks/useBackendSocket";

const Index = () => {
  const [paneCW] = useState([100, 200, 200]);

  // eslint-disable-next-line no-empty-pattern
  const {} = useBackendSocket();

  return (
    <Box>
      {/** Import side navbar*/}
      <SubNavBar />

      <SplitPageLayout>
        <SplitPageLayout.Pane
          position="start"
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
          <Editor />
        </SplitPageLayout.Content>
      </SplitPageLayout>
    </Box>
  );
};

export default Index;
