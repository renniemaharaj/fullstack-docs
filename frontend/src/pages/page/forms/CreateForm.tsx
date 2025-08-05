import { Button, Text } from "@primer/react";
import { FormControl, TextInput } from "@primer/react-brand";

export const CreateForm = () => {
  return (
    <form>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 16,
          margin: "0 auto ",
          maxWidth: 600,
          paddingBottom: 3,
        }}
      >
        <Text as="p" variant="muted" size="100">
          All fields marked with an asterisk (*) are required
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.5fr 1fr",
            gap: 16,
          }}
        >
          <FormControl fullWidth required>
            <FormControl.Label>Document folder</FormControl.Label>
            <TextInput required autoComplete="family-name" />
          </FormControl>
          <FormControl fullWidth required>
            <FormControl.Label>Document title</FormControl.Label>
            <TextInput required autoComplete="given-name" />
          </FormControl>
        </div>

        <FormControl fullWidth required>
          <FormControl.Label>Document description</FormControl.Label>
          <TextInput required />
        </FormControl>

        <div
          style={{
            justifyContent: "end",
            display: "inline-grid",
            gap: 16,
          }}
        >
          <Button variant="primary" type="submit">
            Create Document
          </Button>
        </div>
      </div>
    </form>
  );
};
