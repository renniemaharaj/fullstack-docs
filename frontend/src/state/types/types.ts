// The document type
export interface Document {
  id: number;
  title: string;
  description: string;
  content: string;
  folder: string;
  authorID: number;
  eventID: number;
  archived: boolean;
  published: boolean;
}

export interface File extends Document {
  state: "initial" | "loading" | "done" | "error";
}

export type Folder = {
  name: string;
  count: number;
  subTreeItems: File[];
};
