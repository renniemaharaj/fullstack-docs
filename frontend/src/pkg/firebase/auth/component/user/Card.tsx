import {
  AnchoredOverlay,
  Avatar,
  Button,
  Heading,
  Label,
  Link,
  Text,
  ToggleSwitch,
} from "@primer/react";
import { useState } from "react";
import { type User } from "firebase/auth";
import { Box } from "@primer/react-brand";
import useThemeContext from "../../../../../hooks/theme/useThemeContext";

const Card = ({
  user,
  handleSignOut,
  handleSignIn,
}: {
  user: User | null;
  handleSignOut: () => Promise<void>;
  handleSignIn: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const displayName = user?.displayName ?? "Guest";

  const { theme, specifyTheme } = useThemeContext();

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={(anchorProps) => (
        <Avatar
          {...anchorProps}
          src={user?.photoURL || "/src/assets/avatar.png"}
          alt={displayName}
          size={32}
          sx={{
            cursor: "pointer",
            border: "1px solid",
            borderColor: open ? "accent.fg" : "border.default",
            boxShadow: open ? "shadow.medium" : undefined,
            transition: "border-color 0.2s ease",
          }}
        />
      )}
      width="small"
      preventOverflow
      pinPosition
      overlayProps={{
        sx: {
          p: 3,
          boxShadow: "shadow.medium",
          borderRadius: 2,
          borderColor: "border.default",
          backgroundColor: "canvas.default",
        },
      }}
    >
      <Box className="flex flex-col p-1 gap-2">
        <Box className="flex fol-col  gap-1">
          <Avatar
            src={user?.photoURL || "/src/assets/avatar.png"}
            alt={displayName}
            size={40}
            sx={{ border: "1px solid", borderColor: "border.default" }}
          />
          <Box>
            <Heading className="!text-[1.2rem]">{displayName}</Heading>
            <Text as="p" color="fg.subtle" fontSize={1}>
              {user?.email ?? "-"}
            </Text>
          </Box>
        </Box>

        <Box>
          <Text fontSize={1} display="block">
            <strong>Status:</strong>{" "}
            <Label
              variant={user ? "success" : "danger"}
              className={"ml-1 px-2 py-1 rounded-full"}
            >
              {user ? "Authorized" : "Unauthorized"}
            </Label>
          </Text>

          <Text fontSize={1} display="block" mt={2}>
            <strong>Provider:</strong> {user?.providerId ?? "-"}
          </Text>

          <Text fontSize={1} display="block" mt={2}>
            <strong>Company:</strong>{" "}
            <Link href="https://thewriterco.com" target="_blank">
              TheWriterCo
            </Link>
          </Text>
        </Box>

        <Text fontSize={1} display="block" mt={2}>
          <strong id="default-toggle-label">Dark Mode:</strong>
          <ToggleSwitch
            defaultChecked={theme === "dark"}
            checked={theme === "dark"}
            onClick={() =>
              theme === "light" ? specifyTheme("dark") : specifyTheme("light")
            }
            size="small"
            aria-labelledby="default-toggle-label"
          />
        </Text>

        <Button
          onClick={user ? handleSignOut : handleSignIn}
          variant={user ? "danger" : "default"}
        >
          {user ? "Sign Out" : "Sign In"}
        </Button>
      </Box>
    </AnchoredOverlay>
  );
};

export default Card;
