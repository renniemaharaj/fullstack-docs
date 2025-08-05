import { TextInput, TreeView } from "@primer/react";
import {
  BookIcon,
  DiffAddedIcon,
  DotFillIcon,
  // DiffModifiedIcon,
  FileIcon,
} from "@primer/octicons-react";
import { useCallback } from "react";
import { useAtomValue } from "jotai";

import { fileSystemStorageAtom } from "../../state/writer";
import type { TreeItem } from "../../state/types/types";
import { mockData } from "../../state/config";
import { generateTreeItems } from "../../state/utils";
import { Blankslate } from "@primer/react/experimental";
import { backendSubscribedAtom } from "../../state/app";
const SidePane = () => {
  const fileSystem = useAtomValue(fileSystemStorageAtom);
  const backendSubscribed = useAtomValue(backendSubscribedAtom);

  const renderDocuments = useCallback(
    () => (fileSystem.length ? fileSystem : generateTreeItems(mockData)),
    [fileSystem]
  );

  const TreeItem = useCallback((treeItems: TreeItem[]) => {
    return treeItems.map((item) => (
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
          {item.subTreeItems.map((subItem) => (
            <TreeView.Item
              key={subItem.title}
              id={`${subItem.folder}/${subItem.title}`}
            >
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              {subItem.title}
              <TreeView.TrailingVisual label={subItem.state}>
                {subItem.state === "done" && (
                  <DiffAddedIcon fill="var(--fgColor-success)" />
                )}
                {subItem.state === "loading" && (
                  <DotFillIcon fill="var(--fgColor-accent)" />
                )}
                {subItem.state === "error" && (
                  <DotFillIcon fill="var(--fgColor-danger)" />
                )}
                {subItem.state === "initial" && (
                  <DotFillIcon fill="var(--fgColor-muted)" />
                )}
              </TreeView.TrailingVisual>
            </TreeView.Item>
          ))}
        </TreeView.SubTree>
      </TreeView.Item>
    ));
  }, []);

  return (
    <>
      <TextInput
        size="large"
        aria-label="Demo TextInput"
        type="text"
        placeholder="Find Documents"
      />

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
