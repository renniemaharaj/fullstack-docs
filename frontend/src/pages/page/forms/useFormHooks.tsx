import { useAtomValue } from "jotai";
import { activeDocumentAtom, writerContentAtom } from "../../../state/writer";
import { useCallback } from "react";

const useFormHooks = () => {
  const activeDocument = useAtomValue(activeDocumentAtom);
  const writerContent = useAtomValue(writerContentAtom);

  const isEditorOutOfSync = useCallback(() => {
    if (activeDocument?.id && activeDocument.content !== writerContent) {
      return true;
    }
  }, [activeDocument, writerContent]);

  return { isEditorOutOfSync };
};

export default useFormHooks;
