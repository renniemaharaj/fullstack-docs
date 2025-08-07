import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useUserLikelySignedIn from "../../pkg/firebase/auth/hooks/useUserLikelySignedIn";
import { controlFlow } from "../types/controlFlow";
import { Primitive } from "../types/primitive";
import { useAtom, useSetAtom } from "jotai";
import { showBackendFeaturesAtom } from "../app.atoms";
import useStateStateMutations from "./useStateStateMutations";
import { globalEmitterAtom } from "../atoms/emitter.atom";

// The socket protocol ws or wss
const a = "ws";
// The base socket url
const b = "localhost:8081/protected";

const useSocketSignals = () => {
  const { user, token } = useUserLikelySignedIn();
  const [socketUrl, setSocketUrl] = useState(a + "://" + b + "?token=" + token);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [globalSignalEmitter, setGlobalSignalEmitter] =
    useAtom(globalEmitterAtom);

  const isSocketReady = useCallback(
    () => readyState === ReadyState.OPEN,
    [readyState]
  );

  const stableEmitSignal = useCallback(
    (p: Primitive) => {
      sendMessage(p.toString());
    },
    [sendMessage]
  );

  setGlobalSignalEmitter(() => stableEmitSignal);

  // Subscription to receiving messages
  const setBackendAuthorized = useSetAtom(showBackendFeaturesAtom);
  const { setUserDocuments } = useStateStateMutations();
  useEffect(() => {
    if (!isSocketReady) return;
    if (!lastMessage?.data) return;
    controlFlow(lastMessage?.data, Primitive.validator, (p: Primitive) => {
      if (p.title === "onSubscribed") setBackendAuthorized(true);
      if (p.title === "on!Subscribed") setBackendAuthorized(false);
      if (p.title === "setUserDocs") setUserDocuments(p);
      // const s = new Primitive("/");
      if (p.title === "reload") globalSignalEmitter?.(new Primitive("/"));
      // if (p.title === "greeting") globalSignalEmitter?.(s);
      // if (p.title === "retry") emitSignal(new Primitive("/"));
    });
  }, [
    lastMessage,
    isSocketReady,
    setBackendAuthorized,
    globalSignalEmitter,
    setUserDocuments,
  ]);

  // Subscripion to user tokens and auth responsiveness
  useEffect(() => {
    if (!user) setBackendAuthorized(false);
    if (!user) setSocketUrl(a + "://" + b + "?token=" + "");
    else setSocketUrl(a + "://" + b + "?token=" + token);
  }, [user, token, setBackendAuthorized, setGlobalSignalEmitter]);

  return { sendMessage, readyState };
};
export default useSocketSignals;
