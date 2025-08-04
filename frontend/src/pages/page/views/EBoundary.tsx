import { Button, Heading, Text } from "@primer/react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const EBoundary = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  console.log(error);
  return (
    <div className="flex p-2 gap-1 flex-col w-full items-center">
      <Heading className="!text-[1.2rem]">Something went wrong</Heading>
      <Text as="p" color="fg.subtle" fontSize={1}>
        {error.message || "Couldn't provide details"}
      </Text>

      <Button onClick={resetErrorBoundary}>Reset</Button>
    </div>
  );
};

export default EBoundary;
