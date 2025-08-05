import type { TreeItem, TypeSubTreeItem, Document } from "./types/types";

export function generateTreeItems(documents: Document[]): TreeItem[] {
  const folderMap = new Map<string, TypeSubTreeItem[]>();

  for (const doc of documents) {
    // Derive state
    let state: TypeSubTreeItem["state"] = "initial";
    if (doc.archived) {
      state = "error";
    } else if (doc.published) {
      state = "done";
    }

    const item: TypeSubTreeItem = {
      ...doc,
      state,
    };

    const folder = doc.folder ?? "Uncategorized";
    if (!folderMap.has(folder)) {
      folderMap.set(folder, []);
    }

    folderMap.get(folder)!.push(item);
  }

  const tree: TreeItem[] = [];

  for (const [name, subTreeItems] of folderMap.entries()) {
    tree.push({
      name,
      count: subTreeItems.length,
      subTreeItems,
    });
  }

  return tree;
}
