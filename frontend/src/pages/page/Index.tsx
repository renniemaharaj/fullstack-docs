import Editor from "../../pkg/writer/Editor";
import { SplitPageLayout } from "@primer/react";
import { useState } from "react";
import SubNavBar from "./SubNavBar";
import { Box } from "@primer/react-brand";
import SidePane from "./SidePane";
import useSocketSignals from "../../state/hooks/useSocketSignals";

const Index = () => {
  const [paneCW] = useState([150, 250, 250]);

  // eslint-disable-next-line no-empty-pattern
  const {} = useSocketSignals();

  return (
    <Box>
      {/** Import side navbar*/}
      <SubNavBar />

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
          <Editor />
        </SplitPageLayout.Content>
      </SplitPageLayout>
    </Box>
  );
};

export default Index;
