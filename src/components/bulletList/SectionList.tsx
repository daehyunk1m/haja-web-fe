import { useBulletStore } from "@/shared/bulletStore";
import { useDateStore } from "@/shared/dateStore";
import { useProgressStore } from "@/shared/progressStore";
import { useSwipeRevealStore } from "@/shared/swipeRevealStore";
import { useCallback, useEffect, useMemo } from "react";
import TodoContainer from "../TodoContainer";
import AddBulletBtn from "./AddBulletBtn";
import SortableTaskItem from "./SortableTaskItem";
import PopupContainer from "../PopupContainer";
import { usePopupStore } from "@/shared/popupStores";
import { TaskCore } from "@/shared/TaskCore";
import { useOrderedTasks } from "@/hooks/useOrderedTasks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

const SectionList = ({ type }: { type: "task" | "someday" }) => {
  const isPopupOpen = usePopupStore((state) => state.isModalOpen);
  const dateString = useDateStore((state) => state.toBulletString());

  const postpone = useBulletStore((state) => state.postpone);

  useEffect(() => {
    postpone(dateString);
  }, [dateString, postpone]);

  const tasksMap = useBulletStore((state) => state.tasks);
  // 날짜별 필터 위치 확인해봐야함.
  /** 날짜별 필터 */
  const tasks = useMemo(() => {
    return [...tasksMap.values()].filter(
      (task) =>
        task.type === "someday" ||
        (!task.completedAt ? task.createdAt === dateString : task.completedAt === dateString) ||
        task.shouldCarryForward(dateString)
    );
  }, [dateString, tasksMap]);

  const visibleTasks = useMemo(() => {
    return tasks.filter(filters[type]);
  }, [tasks, type]);

  const { orderedTasks, handleReorder } = useOrderedTasks(visibleTasks, dateString, type);

  const sensors = useSensors(
    // 세로 드래그(순서변경)와 가로 스와이프(삭제)를 축으로 분리한다.
    // 세로 10px↑ 이동 시 순서변경 활성, 활성 전 가로 12px↑ 이동 시 드래그를 취소해 스와이프에 양보한다.
    useSensor(PointerSensor, {
      activationConstraint: { distance: { y: 10 }, tolerance: { x: 12 } },
    }),
    useSensor(KeyboardSensor)
  );

  const { setOpenId } = useSwipeRevealStore((s) => s.actions);
  // 순서변경 드래그가 시작되면 열려 있던 스와이프를 닫는다
  const handleDragStart = useCallback(() => setOpenId(null), [setOpenId]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = orderedTasks.findIndex((t) => t.id === active.id);
      const newIndex = orderedTasks.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(
        orderedTasks.map((t) => t.id),
        oldIndex,
        newIndex
      );
      handleReorder(newOrder);
    },
    [orderedTasks, handleReorder]
  );

  const { setSelectedTasks } = useProgressStore(({ actions }) => actions);

  useEffect(() => {
    setSelectedTasks(tasks);
  }, [setSelectedTasks, tasks]);

  return (
    <>
      <TodoContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {orderedTasks.map((bulletTask) => (
              <SortableTaskItem key={bulletTask.id} bulletTask={bulletTask} />
            ))}
          </SortableContext>
        </DndContext>
      </TodoContainer>
      <AddBulletBtn type={type} />
      {isPopupOpen && <PopupContainer />}
    </>
  );
};

export default SectionList;

// util
const filters: Record<TaskCore["type"], (t: TaskCore) => boolean> = {
  task: (t) => t.type === "task" || (t.type === "someday" && Boolean(t.completedAt)),
  someday: (t) => t.type === "someday" && Boolean(!t.completedAt),
} as const satisfies Record<TaskCore["type"], (t: TaskCore) => boolean>;

// const assertNever = (x: never): never => {
//   throw new Error(`Unhandled view type: ${x}`);
// };
