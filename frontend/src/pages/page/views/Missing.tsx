import { InlineMessage } from "@primer/react/experimental";

const Missing = () => {
  return (
    <div className="flex p-3 flex-col items-center justify-center">
      <h1>404</h1>
      <InlineMessage variant="unavailable">
        The page requested is either missing or unimplemented
      </InlineMessage>
    </div>
  );
};

export default Missing;
