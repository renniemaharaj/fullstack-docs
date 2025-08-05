import type { Folder, File, Document } from "./types/types";

export function FoldersFromDocuments(documents: Document[]): Folder[] {
  const folderMap = new Map<string, File[]>();

  for (const doc of documents) {
    // Derive state
    let state: File["state"] = "initial";
    if (doc.archived) {
      state = "error";
    } else if (doc.published) {
      state = "done";
    }

    const item: File = {
      ...doc,
      state,
    };

    const folder = doc.folder ?? "Uncategorized";
    if (!folderMap.has(folder)) {
      folderMap.set(folder, []);
    }

    folderMap.get(folder)!.push(item);
  }

  const tree: Folder[] = [];

  for (const [name, subTreeItems] of folderMap.entries()) {
    tree.push({
      name,
      count: subTreeItems.length,
      subTreeItems,
    });
  }

  return tree;
}
