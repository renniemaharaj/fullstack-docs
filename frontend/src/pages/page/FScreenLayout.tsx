import React, { useState } from "react";
import { Button } from "@primer/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import { Box } from "@primer/react-brand";

type FullScreenLayoutProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  side: React.ReactNode;
  content: React.ReactNode;
};

/**
 * FScreenLayout
 *
 * A full-screen responsive layout component that includes:
 * - Optional header and footer
 * - A dynamic, collapsible left side panel
 * - Main content area on the right
 *
 * The side panel can be toggled using a built-in button. Layout adapts to screen size,
 * and uses Primer components for consistent UI with Tailwind for layout styling.
 */
export const FScreenLayout: React.FC<FullScreenLayoutProps> = ({
  header,
  footer,
  side,
  content,
}) => {
  // Side panel collapsed width and expanded width in rem units
  const [paneCW] = useState<[number, number]>([4.5, 15]);

  // Track collapsed state of side panel
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      {header && <div className="flex-shrink-0 border-b">{header}</div>}

      {/* Body (Side + Content) */}
      <Box className="flex flex-1 overflow-hidden">
        {/* Side Panel */}
        <div
          className={`flex flex-row transition-all duration-300 ease-in-out h-full border-r`}
          style={{
            width: isCollapsed ? `${paneCW[0]}rem` : `${paneCW[1]}rem`,
          }}
        >
          <div className="h-full w-full p-2 overflow-y-auto">
            {/* Collapse/Expand Button */}
            <div className="w-full mb-2 overflow-auto">
              <Button
                size="small"
                variant="default"
                className="holographic-card w-full"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
              >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </Button>
            </div>

            {/* Side Panel Content (hidden when collapsed) */}
            <div className={isCollapsed ? "hidden" : "block"}>{side}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-2">{content}</div>
      </Box>

      {/* Footer */}
      {footer && <div className="flex-shrink-0 border-t">{footer}</div>}
    </div>
  );
};
