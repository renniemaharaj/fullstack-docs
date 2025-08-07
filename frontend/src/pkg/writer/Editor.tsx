import RichTextEditor from "reactjs-tiptap-editor";

import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "react-image-crop/dist/ReactCrop.css";
import extensions from "./extenstions";
import {
  activeDocumentAtom,
  workingContentAtom,
} from "../../state/writer.atoms";
import { useCallback, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import useThemeContext from "../../hooks/theme/useThemeContext";

function Editor() {
  const setWorkingContent = useSetAtom(workingContentAtom);
  const activeDocument = useAtomValue(activeDocumentAtom);

  const [localContent, setLocalContent] = useState(activeDocument?.content);

  const { theme } = useThemeContext();
  const [key, setKey] = useState(1);

  const onValueChange = useCallback(
    (c: string) => setWorkingContent(c),
    [setWorkingContent]
  );

  useEffect(() => {
    setLocalContent(activeDocument?.content);
    setKey((prev) => prev + 1);
  }, [activeDocument]);

  return (
    <main>
      <div>
        <div className="blurred-div">
          <RichTextEditor
            output="html"
            key={key}
            content={localContent ?? ""}
            onChangeContent={onValueChange}
            extensions={extensions}
            dark={theme === "dark"}
            disabled={!activeDocument?.id}
          />
        </div>
      </div>
    </main>
  );
}

export default Editor;
