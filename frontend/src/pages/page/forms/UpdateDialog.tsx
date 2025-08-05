import React from "react";
import { Button } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { SyncIcon } from "@primer/octicons-react";
import UpdateForm from "./UpdateForm";
import useFormHooks from "./useFormHooks";

const UpdateDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const onDialogClose = React.useCallback(() => setIsOpen(false), []);

  const { isEditorOutOfSync } = useFormHooks();

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
        <Dialog title="Update Document" onClose={onDialogClose}>
          <UpdateForm onClose={() => setIsOpen(false)} />
        </Dialog>
      )}
    </>
  );
};

export default UpdateDialog;
