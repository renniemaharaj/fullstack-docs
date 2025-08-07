import { useSetAtom } from "jotai";
import { showCreateFormAtom } from "../../../state/app.atoms";
import { useEffect } from "react";

const CreateDocument = () => {
  const setShowCreateForm = useSetAtom(showCreateFormAtom);
  useEffect(() => setShowCreateForm(true), [setShowCreateForm]);
  return <></>;
};

export default CreateDocument;
