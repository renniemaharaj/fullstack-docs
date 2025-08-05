import { atom } from "jotai";
import type { File, Folder } from "./types/types";

// Holds the editor's content
export const writerContentAtom = atom<string>();

// Represents the document currently opened
export const activeDocumentAtom = atom<File>();

// Base atom with localStorage
export const fileSystemStorageAtom = atom<Folder[]>([]);
