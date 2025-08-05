import React, { useCallback } from "react";
import { Button } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { SyncIcon } from "@primer/octicons-react";
import { useAtomValue } from "jotai";
import { activeDocumentAtom, writerContentAtom } from "../../../state/writer";

export default function Default() {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const onDialogClose = React.useCallback(() => setIsOpen(false), []);

  const activeDocument = useAtomValue(activeDocumentAtom);
  const writerContent = useAtomValue(writerContentAtom);

  const isEditorOutOfSync = useCallback(() => {
    if (activeDocument?.id && activeDocument.content !== writerContent) {
      return true;
    }
  }, [activeDocument, writerContent]);

  return (
    <>
      <Button
        size="small"
        variant={isEditorOutOfSync() ? "primary" : "default"}
        className={`mt-1`}
        ref={buttonRef}
        leadingVisual={SyncIcon}
        onClick={() => setIsOpen(!isOpen)}
      >
        Active Document
      </Button>
      {isOpen && (
        <Dialog title="My Dialog" onClose={onDialogClose}>
          This is where the dialog content would go.
        </Dialog>
      )}
    </>
  );
}
