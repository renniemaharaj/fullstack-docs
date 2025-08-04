import RichTextEditor from "reactjs-tiptap-editor";

import "reactjs-tiptap-editor/style.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";

import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "react-image-crop/dist/ReactCrop.css";
import extensions from "./extenstions";
import { useThemeContext } from "../../hooks/theme/useThemeContext";
import { useAtomValue } from "jotai";
import { writerContentAtom } from "../../state/writer";
import { useCallback } from "react";

function Editor() {
  const writerContent = useAtomValue(writerContentAtom);
  const { theme } = useThemeContext();

  const onValueChange = useCallback(() => {}, []);

  return (
    <main>
      <div>
        <div className="blurred-div">
          <RichTextEditor
            output="html"
            // key={key}
            content={writerContent || ""}
            onChangeContent={onValueChange}
            extensions={extensions}
            dark={theme === "dark"}
          />
        </div>
      </div>
    </main>
  );
}

export default Editor;
