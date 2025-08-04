import { useSetAtom } from "jotai";
import { controlFlow } from "./types/controlFlow";
import { isPrimitiveType, type Primitive } from "./types/primitive";
import { backendSubscribedAtom } from "../app";

// The message interpreter of socket connection
const useSignalDecoder = () => {
  const setBackendAuthorized = useSetAtom(backendSubscribedAtom);

  const decodeSignal = (s: string) => {
    if (!s) return;
    controlFlow(s, isPrimitiveType, (p: Primitive) => {
      if (p.title === "onSubscribed") setBackendAuthorized(true);
      if (p.title === "on!Subscribed") setBackendAuthorized(false);
    });
  };
  return { decodeSignal };
};

export default useSignalDecoder;
