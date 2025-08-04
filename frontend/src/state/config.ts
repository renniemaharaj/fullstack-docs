import type { TreeItem } from "./types";

export const mockData: TreeItem[] = [
  {
    name: "poetry",
    count: 4,
    subTreeItems: [
      { name: "Example 1", state: "loading", content:"" },
    ],
  },
  {
    name: "inspiration",
    count: 3,
     subTreeItems: [
      { name: "Example 1", state: "loading",content:"" },
    ],
  },
  {
    name: "creativity",
    count: 2,
    subTreeItems: [
      { name: "Example 1", state: "loading",content:"" },
    ],
  },
];