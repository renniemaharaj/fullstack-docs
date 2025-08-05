import { useSetAtom } from "jotai";
import { type Document } from "../types/types";
import { fileSystemStorageAtom } from "../writer";
import { FoldersFromDocuments } from "../utils";
import type { Primitive } from "../types/primitive";
const useStateStateMutations = () => {
  const setFileSystem = useSetAtom(fileSystemStorageAtom);

  const setUserDocuments = (p: Primitive) => {
    try {
      const docs = JSON.parse(p.body) as Document[];
      setFileSystem(FoldersFromDocuments(docs));
    } catch (e) {
      console.log(e);
    }
  };

  return { setUserDocuments };
};

export default useStateStateMutations;
