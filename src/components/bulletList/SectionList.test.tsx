import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import SectionList from "./SectionList";
import { BulletSectionContext } from "@/hooks/useBulletSectionContext";
import type { TBulletSection } from "@/hooks/useBulletSection";
import { useBulletStore } from "@/shared/bulletStore";
import { useProgressStore } from "@/shared/progressStore";
import { useDateStore } from "@/shared/dateStore";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";
import { TaskCore } from "@/shared/TaskCore";
import { Bullet } from "@/shared/types/taskType";

const makeCtx = (tabPosition: "left" | "right"): TBulletSection => ({
  isAddTaskIcon: false,
  setIsAddTaskIcon: () => {},
  tabPosition,
  setTabPosition: () => {},
});

const makeMap = (tasks: TaskCore[]) => new Map(tasks.map((t) => [t.id, t]));

// Body.tsx와 동일하게 task(우측)·someday(좌측) 두 섹션을 모두 마운트한다.
// 두 SectionList가 항상 함께 떠 있어야 진행률 집계 경쟁(race) 회귀를 재현할 수 있다.
const renderBothSections = () =>
  render(
    <>
      <BulletSectionContext.Provider value={makeCtx("right")}>
        <SectionList type='task' />
      </BulletSectionContext.Provider>
      <BulletSectionContext.Provider value={makeCtx("left")}>
        <SectionList type='someday' />
      </BulletSectionContext.Provider>
    </>
  );

describe("SectionList — 진행률(파이차트) 집계 범위", () => {
  beforeEach(() => {
    useProgressStore.setState({ progressRange: 0, selectedTasks: [] });
    useBulletStore.setState({ tasks: new Map(), taskOrder: {} });
    useSectionExpandStore.getState().actions.reset();
  });

  it("someday 태스크는 진행률 계산에서 제외되고 각 날의 태스크만 집계된다", () => {
    const today = useDateStore.getState().toBulletString();

    // 오늘의 태스크 2개 (1개 완료) → 50% 가 되어야 한다
    const dailyDone = new TaskCore("오늘-완료", { createdAt: today }).changeState(Bullet.DONE, today);
    const dailyTodo = new TaskCore("오늘-미완료", { createdAt: today });

    // someday(백로그) 태스크 — 완료/미완료 섞어도 진행률에 영향을 주면 안 된다
    const somedayDone = new TaskCore("섬데이-완료", { type: "someday" }).changeState(Bullet.DONE, today);
    const somedayTodo1 = new TaskCore("섬데이-미완료1", { type: "someday" });
    const somedayTodo2 = new TaskCore("섬데이-미완료2", { type: "someday" });

    useBulletStore.setState({
      tasks: makeMap([dailyDone, dailyTodo, somedayDone, somedayTodo1, somedayTodo2]),
    });

    renderBothSections();

    // 오늘 태스크 2개 중 1개 완료 → 50%.
    // someday 5개가 섞여 들어가면 2/5=40%가 되므로 회귀를 잡는다.
    expect(useProgressStore.getState().progressRange).toBe(50);
  });

  it("오늘 태스크가 없고 someday만 있으면 진행률은 0이다", () => {
    const somedayDone = new TaskCore("섬데이-완료", { type: "someday" }).changeState(
      Bullet.DONE,
      useDateStore.getState().toBulletString()
    );
    const somedayTodo = new TaskCore("섬데이-미완료", { type: "someday" });

    useBulletStore.setState({ tasks: makeMap([somedayDone, somedayTodo]) });

    renderBothSections();

    // someday만 있을 때 someday가 집계되면 1/2=50%가 되어버린다. 각 날 태스크 0개 → 0.
    expect(useProgressStore.getState().progressRange).toBe(0);
  });
});
