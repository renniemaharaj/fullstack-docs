import React, { useCallback, useEffect } from "react";
import { Button } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { CheckIcon, SyncIcon } from "@primer/octicons-react";
import UpdateForm from "./UpdateForm";
import useFormHooks from "./useFormHooks";
import { useSetAtom } from "jotai";
import { showUpdateFormAtom } from "../../../state/app.atoms";

const UpdateDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const onDialogClose = React.useCallback(() => setIsOpen(false), []);

  const { isEditorOutOfSync } = useFormHooks();

  const syncButtonSwitch = useCallback(
    () => (isEditorOutOfSync() ? SyncIcon : CheckIcon),
    [isEditorOutOfSync]
  );

  const setShowUpdateForm = useSetAtom(showUpdateFormAtom);

  useEffect(() => {
    setShowUpdateForm(isOpen);
  }, [isOpen, setShowUpdateForm]);

  return (
    <>
      <Button
        size="small"
        variant={isEditorOutOfSync() ? "primary" : "default"}
        className={`my-[2px]`}
        ref={buttonRef}
        leadingVisual={syncButtonSwitch()}
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
