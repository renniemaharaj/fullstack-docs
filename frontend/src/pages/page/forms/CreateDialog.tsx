import React from "react";
// import { Button } from "@primer/react";
import { Dialog } from "@primer/react/experimental";
import { CreateForm } from "./CreateForm";
import { useAtom } from "jotai";
import { displayCreateFormAtom } from "./atoms/createForm";

export default function CreateFormDialog() {
  const [isOpen, setIsOpen] = useAtom(displayCreateFormAtom);
  //   const buttonRef = React.useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDialogClose = React.useCallback(() => setIsOpen(false), []);
  return (
    isOpen && (
      <Dialog
        className="!z-[99]"
        title="New Document"
        onClose={onDialogClose}
        //   returnFocusRef={buttonRef}
      >
        <CreateForm />
      </Dialog>
    )
  );
}
