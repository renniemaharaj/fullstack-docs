import { atom } from "jotai";
import type { TreeItem } from "./types";

// Atom for content
export const writerContentAtom = atom<string>();

// Base atom with localStorage
export const fileSystemStorageAtom = atom<TreeItem[]>([]);
