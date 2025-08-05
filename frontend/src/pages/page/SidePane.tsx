import { TextInput, TreeView } from "@primer/react";
import {
  BookIcon,
  DiffAddedIcon,
  DotFillIcon,
  // DiffModifiedIcon,
  FileIcon,
} from "@primer/octicons-react";
import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";

import { activeDocumentAtom, fileSystemStorageAtom } from "../../state/writer";
import type { File, Folder } from "../../state/types/types";
import { mockData } from "../../state/config";
import { FoldersFromDocuments } from "../../state/utils";
import { Blankslate } from "@primer/react/experimental";
import { backendSubscribedAtom } from "../../state/app";
import UpdateDialog from "./forms/UpdateDialog";
const SidePane = () => {
  const fileSystem = useAtomValue(fileSystemStorageAtom);
  const backendSubscribed = useAtomValue(backendSubscribedAtom);

  const [activeDocument, setActiveDocument] = useAtom(activeDocumentAtom);

  const isActiveDocument = useCallback(
    (file: File) => file.id === activeDocument?.id,
    [activeDocument]
  );

  const renderDocuments = useCallback(
    () => (fileSystem.length ? fileSystem : FoldersFromDocuments(mockData)),
    [fileSystem]
  );

  const isDocumentActive = useCallback(
    () => activeDocument?.id != undefined,
    [activeDocument]
  );

  const TreeItem = useCallback(
    (folders: Folder[]) => {
      return folders.map((item) => (
        <TreeView.Item key={item.name} id={`tree-${item.name}`}>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          {item.name}
          <TreeView.SubTree
            state={
              item.subTreeItems.some((subItem) => subItem.state === "loading")
                ? "loading"
                : "done"
            }
            count={Math.max(
              item.subTreeItems.filter((subItem) => subItem.state === "loading")
                .length,
              item.count
            )}
          >
            {item.subTreeItems.map((document) => (
              <TreeView.Item
                key={document.title}
                id={`${document.folder}/${document.title}`}
                onSelect={() => setActiveDocument(document)}
                current={isActiveDocument(document)}
                className="mt-[2px]"
              >
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                {document.title}
                <TreeView.TrailingVisual label={document.state}>
                  {document.state === "done" && (
                    <DiffAddedIcon fill="var(--fgColor-success)" />
                  )}
                  {document.state === "loading" && (
                    <DotFillIcon fill="var(--fgColor-accent)" />
                  )}
                  {document.state === "error" && (
                    <DotFillIcon fill="var(--fgColor-danger)" />
                  )}
                  {document.state === "initial" && (
                    <DotFillIcon fill="var(--fgColor-muted)" />
                  )}
                </TreeView.TrailingVisual>
              </TreeView.Item>
            ))}
          </TreeView.SubTree>
        </TreeView.Item>
      ));
    },
    [isActiveDocument, setActiveDocument]
  );

  return (
    <>
      <TextInput
        size="large"
        aria-label="Demo TextInput"
        type="text"
        placeholder="Find Documents"
      />

      {/** Watches the current document */}
      {isDocumentActive() && <UpdateDialog />}

      {fileSystem.length ? (
        <TreeView aria-label="Files changed" className="flex flex-col !mt-1">
          {TreeItem(renderDocuments())}
        </TreeView>
      ) : (
        <Blankslate>
          <Blankslate.Visual>
            <BookIcon size="medium" />
          </Blankslate.Visual>
          <Blankslate.Heading>File Explorer</Blankslate.Heading>
          <Blankslate.Description>
            {backendSubscribed
              ? "You don't have any documents, create some to see them here."
              : "Sign in to see your documents. You'll see your documents here if you have any."}
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
