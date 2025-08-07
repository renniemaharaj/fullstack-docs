import { DotFillIcon, FileIcon } from "@primer/octicons-react";
import type { File } from "../../state/types/types";
import { TreeView } from "@primer/react";
import useFormHooks from "./forms/useFormHooks";
import { useAtom, useAtomValue } from "jotai";
import { activeDocumentAtom } from "../../state/writer.atoms";
import { useCallback } from "react";
import {
  explorerFilterAtom,
  showCommunityPageAtom,
} from "../../state/app.atoms";

const FileComp = ({ document }: { document: File }) => {
  const [activeDocument, setActiveDocument] = useAtom(activeDocumentAtom);
  const showCommunityPage = useAtom(showCommunityPageAtom);
  const explorerFilter = useAtomValue(explorerFilterAtom);
  const { isEditorOutOfSync } = useFormHooks();
  const isActiveDocument = useCallback(
    (file: File) => file.id === activeDocument?.id,
    [activeDocument]
  );

  const isFileRelevant = useCallback(
    (file: File) => {
      const keywords = explorerFilter.toLowerCase().split(" ");

      return keywords.some(
        (word) =>
          file.title.toLowerCase().includes(word) ||
          file.description.toLowerCase().includes(word) ||
          file.content.toLowerCase().includes(word)
      );
    },

    [explorerFilter]
  );

  return !explorerFilter || isFileRelevant(document) ? (
    <TreeView.Item
      key={document.id + document.title}
      id={`${document.folder}/${document.title}`}
      onSelect={() =>
        showCommunityPage
          ? (location.href = `/community/view/${document.id}`)
          : setActiveDocument(document)
      }
      current={isActiveDocument(document)}
      className="mt-[2px]"
    >
      <TreeView.LeadingVisual>
        <FileIcon />
      </TreeView.LeadingVisual>
      {document.title}
      <TreeView.TrailingVisual label={document.state}>
        {document.state === "done" && (
          <DotFillIcon fill="var(--fgColor-success)" />
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
        {document.id === activeDocument?.id && isEditorOutOfSync() && (
          <DotFillIcon fill="var(--fgColor-danger)" />
        )}
      </TreeView.TrailingVisual>
    </TreeView.Item>
  ) : (
    <></>
  );
};

export default FileComp;
