import { useBulletSectionContext } from "@/hooks/useBulletSectionContext";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";
import { PropsWithChildren, useEffect } from "react";

const SectionContainer = ({
  children,
  position,
}: PropsWithChildren<{
  position: "left" | "right";
}>) => {
  const { setTabPosition } = useBulletSectionContext();
  const kind = position === "right" ? "task" : "someday";
  const isExpanded = useSectionExpandStore((s) => s.expanded === kind);

  useEffect(() => {
    setTabPosition(position);
  }, [position, setTabPosition]);

  // 두 섹션 모두 basis-auto를 유지하고 flex-grow만(0↔1) 전환한다.
  // 확장된 섹션만 grow=1이라 두 grow의 합이 항상 1로 일정해 높이가 선형으로 변하고,
  // flex-grow에 ease 전환을 걸어 부드럽게 열리고 닫힌다(접근성: 모션 최소화 시 즉시 전환).
  return (
    <div
      data-section={kind}
      data-expanded={isExpanded}
      className={`w-full flex flex-col min-h-0 basis-auto
        transition-[flex-grow] duration-300 ease-in-out motion-reduce:transition-none
        ${isExpanded ? "grow" : "grow-0 shrink-0"}
        ${position === "left" ? "items-start" : "items-end"}`}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
