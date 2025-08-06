import { useSetAtom } from "jotai";
import { type Document } from "../types/types";
import { fileSystemStorageAtom } from "../writer";
import { FoldersFromDocuments } from "../utils";
import type { Primitive } from "../types/primitive";
import { useCallback } from "react";
const useStateStateMutations = () => {
  const setFileSystem = useSetAtom(fileSystemStorageAtom);

  const setUserDocuments = useCallback(
    (p: Primitive) => {
      setFileSystem([]);
      try {
        const docs = JSON.parse(p.body) as Document[];
        setFileSystem(FoldersFromDocuments(docs));
      } catch (e) {
        console.log(e);
      }
    },
    [setFileSystem]
  );

  return { setUserDocuments };
};

export default useStateStateMutations;
