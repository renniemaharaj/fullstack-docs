import { useEffect, useRef } from "react";

import { Button } from "@primer/react";
import { CodeXml, Trash2 } from "lucide-react";
import FlexBreak from "./FlexBreak";
import Collapsible from "../collapsible/Collapsible";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Content = any;

export type Document = {
  title: string;
  content: Content;
};

type SaveProps = {
  index: string;
  save: Document;
  title: string;
  loadSave: (title: string) => void;
  deleteSave: (title: string) => void;
  fileMenuOpen?: boolean;
};

const Save = ({
  index,
  save,
  title,
  loadSave,
  deleteSave,
  fileMenuOpen,
}: SaveProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (title === save.title && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [title, save.title, fileMenuOpen]);

  return (
    <Collapsible
      key={index}
      title={save.title}
      collapsibleRef={elementRef}
      renderedTitle={
        <div className="flex">
          <span className="text-2xl">📄</span>
          <span
            className={`text-xs mt-1 text-center font-medium max-w-[11rem] overflow-hidden text-ellipsis whitespace-nowrap ${
              title === save.title && "!font-bold"
            }`}
          >
            {save.title}
          </span>
        </div>
      }
      className="!w-full !justify-start"
    >
      <div className="flex flex-row !gap-3">
        <Button onClick={() => loadSave(save.title)}>
          <CodeXml className="w-4 h-4" />
          Render
        </Button>

        <Button onClick={() => deleteSave(save.title)}>
          <Trash2 className="w-4 h-4" />
          Trash
        </Button>
        <FlexBreak />
      </div>
    </Collapsible>
  );
};

export default Save;
