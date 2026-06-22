import { PropsWithChildren } from "react";
import { useBulletSection } from "@/hooks/useBulletSection";
import { BulletSectionContext } from "@/hooks/useBulletSectionContext";
import SectionTab from "./SectionTab";
import SectionList from "./SectionList";
import SectionContainer from "./SectionContainer";

export default function Section({ children }: PropsWithChildren) {
  const bulletSection = useBulletSection();

  return (
    <BulletSectionContext.Provider value={bulletSection}>{children}</BulletSectionContext.Provider>
  );
}

Section.Container = ({ children, position }: PropsWithChildren<{ position: "left" | "right" }>) => (
  <SectionContainer position={position}>{children}</SectionContainer>
);

Section.Tab = SectionTab;
Section.List = SectionList;
