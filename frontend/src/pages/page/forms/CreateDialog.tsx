import React from "react";
// import { Button } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { CreateForm } from "./CreateForm";
import { useAtom } from "jotai";
import { showCreateFormAtom } from "../../../state/app.atoms";

export default function CreateFormDialog() {
  const [isOpen, setIsOpen] = useAtom(showCreateFormAtom);
  const onDialogClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    isOpen && (
      <Dialog className="!z-[99]" title="New Document" onClose={onDialogClose}>
        <CreateForm onClose={() => setIsOpen(false)} />
      </Dialog>
    )
  );
}
