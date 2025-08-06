import { useImage } from "react-image";
import useUserLikelySignedIn from "../../hooks/useUserLikelySignedIn";

const useSafeAvatarSrc = () => {
  const { user } = useUserLikelySignedIn();

  const { src, error } = useImage({
    srcList: [user?.photoURL || "", "/avatar.png"],
  });

  return {
    src: error ? "/avatar.png" : src,
  };
};

export default useSafeAvatarSrc;
