import { atom } from "jotai";
import type { Document, Folder } from "./types/types";

// Holds the editor's content
export const workingContentAtom = atom<string>();

// Represents the document currently opened
export const activeDocumentAtom = atom<Document>();

// Base atom with localStorage
export const fileSystemStorageAtom = atom<Folder[]>([]);
