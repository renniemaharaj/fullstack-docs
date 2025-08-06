import { useCallback, useState } from "react";
import { SubdomainNavBar } from "@primer/react-brand";
import AuthUser from "../../pkg/firebase/auth/AuthUser";
import "./styles.css";
import { useAtomValue } from "jotai";
import { backendSubscribedAtom } from "../../state/app";
import { displayCreateFormAtom } from "./forms/atoms/createForm";

const SubNavBar = () => {
  const [subDomain] = useState("Editor");
  const backendSubscribed = useAtomValue(backendSubscribedAtom);

  const createFormDisplayed = useAtomValue(displayCreateFormAtom);

  const actionClassName = useCallback(() => {
    return !backendSubscribed ? "!opacity-[0.2] !cursor-not-allowed" : "";
  }, [backendSubscribed]);

  return (
    <SubdomainNavBar
      className={`${createFormDisplayed && "!static"}`}
      logoHref="/"
      title={subDomain}
      fixed={false}
    >
      <SubdomainNavBar.Link href="/">Community</SubdomainNavBar.Link>
      <SubdomainNavBar.Link href="/">Trending</SubdomainNavBar.Link>
      <SubdomainNavBar.Link href="/">Sessions</SubdomainNavBar.Link>
      <SubdomainNavBar.Search onSubmit={() => {}} onChange={() => {}} />
      <SubdomainNavBar.PrimaryAction
        className={actionClassName()}
        href="/create"
      >
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
