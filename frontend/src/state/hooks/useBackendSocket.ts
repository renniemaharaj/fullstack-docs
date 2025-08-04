import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useSignalDecoder from "./useSignalDecoder";
import useUserLikelySignedIn from "../../pkg/firebase/auth/hooks/useUserLikelySignedIn";

// The socket protocol ws or wss
const a = "ws";
// The base socket url
const b = "localhost:8081/protected";

const useBackendSocket = () => {
  const { user, token } = useUserLikelySignedIn();
  const [socketUrl, setSocketUrl] = useState(a + "://" + b + "?token=" + token);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const { decodeSignal } = useSignalDecoder();

  const isSocketReady = useCallback(
    () => readyState === ReadyState.OPEN,
    [readyState]
  );

  useEffect(() => {
    if (!isSocketReady) return;
    decodeSignal(lastMessage?.data);
  }, [lastMessage, decodeSignal, isSocketReady]);

  useEffect(() => {
    if (!user) decodeSignal(`{"title":"on!Subscribed","body":""}`);
    if (!user) setSocketUrl(a + "://" + b + "?token=" + "");
    else setSocketUrl(a + "://" + b + "?token=" + token);
  }, [user, token, decodeSignal]);

  return { sendMessage, readyState };
};
export default useBackendSocket;
