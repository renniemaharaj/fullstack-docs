import { useCallback, useState } from "react";
import { SubdomainNavBar } from "@primer/react-brand";
import AuthUser from "../../pkg/firebase/auth/AuthUser";
import "./styles.css";
import { useAtomValue } from "jotai";
import {
  showBackendFeaturesAtom,
  showCreateFormAtom,
  showUpdateFormAtom,
} from "../../state/app.atoms";

const SubNavBar = () => {
  const [subDomain] = useState("WriterCo");
  const showBackendFeatures = useAtomValue(showBackendFeaturesAtom);

  const showCreateForm = useAtomValue(showCreateFormAtom);
  const showUpdateForm = useAtomValue(showUpdateFormAtom);

  const actionClassName = useCallback(() => {
    return !showBackendFeatures ? "!opacity-[0.2] !cursor-not-allowed" : "";
  }, [showBackendFeatures]);

  return (
    <SubdomainNavBar
      className={`${showCreateForm || (showUpdateForm && "!static")}`}
      logoHref="/"
      title={subDomain}
      fixed={false}
    >
      <SubdomainNavBar.Link href="/community">Community</SubdomainNavBar.Link>
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
