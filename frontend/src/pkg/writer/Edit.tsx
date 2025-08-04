/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Dialog, IconButton, Tooltip } from "@primer/react";
import { ScanText } from "lucide-react";
import React, { useCallback, useState } from "react";

const Edit = ({
  animateCopy,
}: {
  content: any;
  animateCopy: () => Promise<void>;
}) => {
  const [, setIsOpen] = useState(false);
  const buttonRef = React.createRef<HTMLButtonElement>();
  const onDialogClose = useCallback(() => setIsOpen(false), []);

  const copyAndLaunch = useCallback(() => {
    animateCopy().then(() => {
      //Save to jotai atom and redirect to home
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Tooltip text="Copy Document">
        <IconButton
          ref={buttonRef}
          aria-label="Copy"
          icon={ScanText}
          className="!absolute !top-1 !right-1 !z-10"
          onClick={() => setIsOpen(true)}
        />
      </Tooltip>

      <Dialog onClose={onDialogClose}>
        Copy Document Copy and launch this document in the online writer? This
        will clear any unsaved work.
        <Button color="gray">Cancel</Button>
        <Button onClick={copyAndLaunch}>Confirm</Button>
      </Dialog>
    </>
  );
};

export default Edit;
