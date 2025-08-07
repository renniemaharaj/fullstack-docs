import { Button, Text } from "@primer/react";
import { FormControl, TextInput } from "@primer/react-brand";
import { useEffect, useRef } from "react";
import { Primitive } from "../../../state/types/primitive";
import { useAtomValue } from "jotai";
import { globalEmitterAtom } from "../../../state/app.atoms";

export const CreateForm = ({ onClose }: { onClose: () => void }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const emitSocketSignal = useAtomValue(globalEmitterAtom);

  useEffect(() => {
    if (!formRef.current) return;
    const form = formRef.current;

    const formSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const formData = new FormData(form);

      const folder = formData.get("folder");
      const title = formData.get("title");
      const description = formData.get("description");

      const signal = new Primitive("/cdoc");
      signal.body = JSON.stringify({ folder, title, description });
      emitSocketSignal?.(signal);
      onClose();
    };

    form.addEventListener("submit", formSubmit);
    return () => form.removeEventListener("submit", formSubmit);
  }, [emitSocketSignal, onClose]);

  return (
    <form ref={formRef}>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 16,
          margin: "0 auto",
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
            <TextInput name="folder" required autoComplete="family-name" />
          </FormControl>
          <FormControl fullWidth required>
            <FormControl.Label>Document title</FormControl.Label>
            <TextInput name="title" required autoComplete="given-name" />
          </FormControl>
        </div>

        <FormControl fullWidth required>
          <FormControl.Label>Document description</FormControl.Label>
          <TextInput name="description" required />
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
