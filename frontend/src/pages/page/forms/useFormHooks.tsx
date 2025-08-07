import { useAtomValue } from "jotai";
import {
  activeDocumentAtom,
  workingContentAtom,
} from "../../../state/writer.atoms";
import { useCallback } from "react";

const useFormHooks = () => {
  const activeDocument = useAtomValue(activeDocumentAtom);
  const workingContent = useAtomValue(workingContentAtom);

  const isEditorOutOfSync = useCallback(() => {
    if (activeDocument?.id && activeDocument.content !== workingContent) {
      return true;
    }
  }, [activeDocument, workingContent]);

  return { isEditorOutOfSync };
};

export default useFormHooks;
