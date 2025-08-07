import type { Folder } from "../../state/types/types";
import { TreeView } from "@primer/react";

const FolderComp = ({
  folder: folder,
  children,
}: {
  folder: Folder;
  children: React.ReactNode[];
}) => {
  return (
    <TreeView.Item key={folder.name} id={`tree-${folder.name}`} expanded>
      <TreeView.LeadingVisual>
        <TreeView.DirectoryIcon />
      </TreeView.LeadingVisual>
      {folder.name}
      <TreeView.SubTree
        state={
          folder.subTreeItems.some((subItem) => subItem.state === "loading")
            ? "loading"
            : "done"
        }
        count={Math.max(
          folder.subTreeItems.filter((subItem) => subItem.state === "loading")
            .length,
          folder.count
        )}
      >
        {children}
      </TreeView.SubTree>
    </TreeView.Item>
  );
};

export default FolderComp;
