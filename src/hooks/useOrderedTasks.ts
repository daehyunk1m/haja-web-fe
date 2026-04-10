import { useMemo, useCallback } from "react";
import { useBulletStore } from "@/shared/bulletStore";
import { TaskCore } from "@/shared/TaskCore";
import { buildOrderKey } from "@/utils/orderKey";

export function useOrderedTasks(
  tasks: TaskCore[],
  dateString: string,
  type: "task" | "someday"
) {
  const orderKey = buildOrderKey(dateString, type);
  const taskOrder = useBulletStore((state) => state.taskOrder);
  const reorderTasks = useBulletStore((state) => state.reorderTasks);

  const orderedTasks = useMemo(() => {
    const order = taskOrder[orderKey];
    if (!order || order.length === 0) return tasks;

    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const ordered: TaskCore[] = [];

    for (const id of order) {
      const task = taskMap.get(id);
      if (task) {
        ordered.push(task);
        taskMap.delete(id);
      }
    }
    // 순서에 없는 새 태스크는 끝에 추가
    for (const task of taskMap.values()) {
      ordered.push(task);
    }
    return ordered;
  }, [tasks, taskOrder, orderKey]);

  const handleReorder = useCallback(
    (newOrderedIds: string[]) => {
      reorderTasks(orderKey, newOrderedIds);
    },
    [reorderTasks, orderKey]
  );

  return { orderedTasks, handleReorder };
}
