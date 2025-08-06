import { useAtom, useSetAtom } from "jotai";
import { type Document } from "../types/types";
import { activeDocumentAtom, fileSystemStorageAtom } from "../writer";
import { FoldersFromDocuments } from "../utils";
import type { Primitive } from "../types/primitive";
import { useCallback } from "react";
const useStateStateMutations = () => {
  const setFileSystem = useSetAtom(fileSystemStorageAtom);
  const [activeDocument, setActiveDocument] = useAtom(activeDocumentAtom);

  const setUserDocuments = useCallback(
    (p: Primitive) => {
      setFileSystem([]);
      try {
        const docs = JSON.parse(p.body) as Document[];
        setFileSystem(FoldersFromDocuments(docs));
        if (activeDocument?.id) {
          const updated = docs.filter((doc) => doc.id === activeDocument.id);
          if (updated.length > 0) setActiveDocument(updated[0]);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [activeDocument?.id, setActiveDocument, setFileSystem]
  );

  return { setUserDocuments };
};

export default useStateStateMutations;
