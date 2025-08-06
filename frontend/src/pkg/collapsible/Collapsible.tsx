import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@primer/react";
import useThemePreference from "../../hooks/theme/useThemePreference";

type CollapsibleProps = {
  title: ReactNode;
  renderedTitle?: ReactNode;
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  onOpen?: (content: ReactNode) => void;
  onClose?: () => void;
  collapsibleRef?: React.Ref<HTMLDivElement>;
};

const Collapsible = ({
  title,
  renderedTitle,
  children,
  maxHeight = "200px",
  className,
  onOpen,
  onClose,
  collapsibleRef,
}: CollapsibleProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useThemePreference();

  useEffect(() => {
    if (!isCollapsed && onClose) {
      onClose();
    } else if (isCollapsed && onOpen) {
      onOpen(children);
    }
  }, [isCollapsed, onOpen, onClose, children]);

  return (
    <div
      ref={collapsibleRef}
      className={`${theme === "light" && "border"} ${className} w-full rounded-lg shadow-sm`}
    >
      {/* Header / Trigger */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="!flex !items-center !justify-between !w-full !p-3 !transition !rounded-full"
        aria-expanded={isCollapsed}
        aria-controls="collapsible-content"
      >
        <span className="font-semibold">{renderedTitle ?? title}</span>
        <ChevronDown
          className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
        />
      </Button>

      {/* Collapsible Content */}
      <div
        className={`overflow-auto transition-all duration-300 max-h-[${maxHeight}]`}
      >
        <div className={`!py-4 `}>{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;
