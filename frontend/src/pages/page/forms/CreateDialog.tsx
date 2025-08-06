import React from "react";
// import { Button } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { CreateForm } from "./CreateForm";
import { useAtom } from "jotai";
import { displayCreateFormAtom } from "./atoms/createForm";

export default function CreateFormDialog() {
  const [isOpen, setIsOpen] = useAtom(displayCreateFormAtom);
  const onDialogClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    isOpen && (
      <Dialog className="!z-[99]" title="New Document" onClose={onDialogClose}>
        <CreateForm onClose={() => setIsOpen(false)} />
      </Dialog>
    )
  );
}
