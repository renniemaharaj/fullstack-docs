import { TreeView } from "@primer/react";
import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { BookIcon } from "@primer/octicons-react";
import {
  activeDocumentAtom,
  fileSystemStorageAtom,
} from "../../state/writer.atoms";
import type { Folder } from "../../state/types/types";
import { mockData } from "../../state/config";
import { FoldersFromDocuments } from "../../state/utils";
import {
  // explorerFilterAtom,
  showBackendFeaturesAtom,
  showCommunityPageAtom,
} from "../../state/app.atoms";
import FolderComp from "./Folder";
import FileComp from "./File";
import UpdateDialog from "./forms/UpdateDialog";
import { Blankslate } from "@primer/react/experimental";
const SidePane = () => {
  const fileSystem = useAtomValue(fileSystemStorageAtom);
  const showBackendFeatures = useAtomValue(showBackendFeaturesAtom);
  const showCommunityPage = useAtomValue(showCommunityPageAtom);

  const activeDocument = useAtomValue(activeDocumentAtom);

  // const setExplorerFilter = useAtomValue(explorerFilterAtom);

  const isDocumentActive = useCallback(
    () => activeDocument?.id != undefined,
    [activeDocument]
  );

  const renderDocuments = useCallback(
    () => (fileSystem.length ? fileSystem : FoldersFromDocuments(mockData)),
    [fileSystem]
  );

  const TreeItem = useCallback((folders: Folder[]) => {
    return folders.map((item) => (
      <FolderComp folder={item}>
        {item.subTreeItems.map((document) => (
          <FileComp document={document} />
        ))}
      </FolderComp>
    ));
  }, []);

  return (
    <>
      {fileSystem.length ? (
        <TreeView aria-label="Files changed" className="flex flex-col !w-full">
          {/* <TextInput
            aria-label="Filter Documents"
            placeholder="Filter Documents"
            size="large"
            type="text"
            className="m-1"
          /> */}
          {/** Watches the current document */}
          {isDocumentActive() && !showCommunityPage && <UpdateDialog />}
          {TreeItem(renderDocuments())}
        </TreeView>
      ) : (
        <Blankslate>
          <Blankslate.Visual>
            <BookIcon size="medium" />
          </Blankslate.Visual>
          <Blankslate.Heading>File Explorer</Blankslate.Heading>
          <Blankslate.Description>
            {showBackendFeatures
              ? "You don't have any files, create some. They will be listed here."
              : "Sign in to see your files. You'll see your documents here if you have any."}
          </Blankslate.Description>

          <Blankslate.PrimaryAction href="/create">
            New Document
          </Blankslate.PrimaryAction>
        </Blankslate>
      )}
    </>
  );
};

export default SidePane;
