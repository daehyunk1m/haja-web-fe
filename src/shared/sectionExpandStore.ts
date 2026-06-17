import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { pickInitialExpanded, type SectionKind } from "@/utils/sectionFold";

const initialState = {
  /** 현재 확장된 섹션. 두 섹션 중 항상 정확히 하나만 확장된다(아코디언). */
  expanded: "task" as SectionKind,
  /** 진입 자동 확장이 확정됐거나 사용자가 토글했는지 여부. true면 자동 확장이 개입하지 않는다. */
  initialized: false,
  /** 진입 자동 확장 판단용 섹션별 태스크 수 (미보고는 null). */
  counts: { task: null as number | null, someday: null as number | null },
};

export const useSectionExpandStore = create(
  devtools(
    combine(initialState, (set, get) => ({
      actions: {
        /**
         * 섹션의 태스크 수를 보고한다(마운트 시 1회). 두 섹션이 모두 보고되면
         * 더 많은 쪽을 자동 확장하고 확정(initialized)한다. 확정/토글 이후엔 무시한다.
         */
        reportCount: (kind: SectionKind, count: number) => {
          if (get().initialized) return;
          const counts = { ...get().counts, [kind]: count };
          if (counts.task === null || counts.someday === null) {
            set({ counts });
            return;
          }
          set({
            counts,
            expanded: pickInitialExpanded(counts.task, counts.someday),
            initialized: true,
          });
        },
        /** 확장 섹션을 전환한다 — 둘 중 하나만 확장되므로 어느 탭을 눌러도 전환이 된다. */
        toggle: () =>
          set((s) => ({ expanded: s.expanded === "task" ? "someday" : "task", initialized: true })),
        /** 초기 상태로 되돌린다(테스트/재진입용). */
        reset: () =>
          set({ expanded: "task", initialized: false, counts: { task: null, someday: null } }),
      },
    }))
  )
);
