export type TypeSubTreeItem = {
  state: "initial" | "loading" | "done" | "error";
  content: string;
  name: string;
};

export type TreeItem = {
  name: string;
  count: number;
  subTreeItems: TypeSubTreeItem[];
};