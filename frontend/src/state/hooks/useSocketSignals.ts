import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useUserLikelySignedIn from "../../pkg/firebase/auth/hooks/useUserLikelySignedIn";
import { controlFlow } from "../types/controlFlow";
import { Primitive } from "../types/primitive";
import { useSetAtom } from "jotai";
import { backendSubscribedAtom } from "../app";
import useStateStateMutations from "./useStateStateMutations";

// The socket protocol ws or wss
const a = "ws";
// The base socket url
const b = "localhost:8081/protected";

const useSocketSignals = () => {
  const { user, token } = useUserLikelySignedIn();
  const [socketUrl, setSocketUrl] = useState(a + "://" + b + "?token=" + token);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const isSocketReady = useCallback(
    () => readyState === ReadyState.OPEN,
    [readyState]
  );

  const emitSignal = useCallback(
    (p: Primitive) => {
      console.log(p);
      // console.log(p.toString());
      sendMessage(p.toString());
    },
    [sendMessage]
  );

  // Subscription to receiving messages
  const setBackendAuthorized = useSetAtom(backendSubscribedAtom);
  const { setUserDocuments } = useStateStateMutations();
  useEffect(() => {
    if (!isSocketReady) return;
    if (!lastMessage?.data) return;
    controlFlow(lastMessage?.data, Primitive.validator, (p: Primitive) => {
      if (p.title === "onSubscribed") setBackendAuthorized(true);
      if (p.title === "on!Subscribed") setBackendAuthorized(false);
      if (p.title === "setUserDocs") setUserDocuments(p);
      if (p.title === "reload") emitSignal(new Primitive("/"));
      if (p.title === "greeting") emitSignal(new Primitive("/"));
      // if (p.title === "retry") emitSignal(new Primitive("/"));
    });
  }, [
    lastMessage,
    isSocketReady,
    setBackendAuthorized,
    emitSignal,
    setUserDocuments,
  ]);

  // Subscripion to user tokens and auth responsiveness
  useEffect(() => {
    if (!user) setBackendAuthorized(false);
    if (!user) setSocketUrl(a + "://" + b + "?token=" + "");
    else setSocketUrl(a + "://" + b + "?token=" + token);
  }, [user, token, setBackendAuthorized]);

  return { sendMessage, emitSignal, readyState };
};
export default useSocketSignals;
