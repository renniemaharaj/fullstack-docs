import { useCallback, useState } from "react";
import { SubdomainNavBar } from "@primer/react-brand";
import AuthUser from "../../pkg/firebase/auth/component/AuthUser";
import "./styles.css";
import { useAtomValue } from "jotai";
import { backendSubscribedAtom } from "../../state/app";

const SubNavBar = () => {
  const [subDomain] = useState("Editor");
  const backendSubscribed = useAtomValue(backendSubscribedAtom);

  const actionClassName = useCallback(() => {
    return !backendSubscribed ? "!opacity-[0.2] !cursor-not-allowed" : "";
  }, [backendSubscribed]);

  return (
    <SubdomainNavBar logoHref="/" title={subDomain} fixed={false}>
      <SubdomainNavBar.Link href="#">Community</SubdomainNavBar.Link>
      <SubdomainNavBar.Link href="#">Trending</SubdomainNavBar.Link>
      <SubdomainNavBar.Link href="#">Sessions</SubdomainNavBar.Link>
      <SubdomainNavBar.Search onSubmit={() => {}} onChange={() => {}} />
      <SubdomainNavBar.PrimaryAction className={actionClassName()} href="#">
        New Document
      </SubdomainNavBar.PrimaryAction>
      {/* <SubdomainNavBar.SecondaryAction className={actionClassName()} href="#">
        New Page
      </SubdomainNavBar.SecondaryAction> */}
      <SubdomainNavBar.SecondaryAction href="#" className="!border-none">
        <AuthUser variant="image" />{" "}
      </SubdomainNavBar.SecondaryAction>
    </SubdomainNavBar>
  );
};

export default SubNavBar;
