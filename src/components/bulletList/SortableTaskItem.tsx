import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "../TaskItem";
import { TaskCore } from "@/shared/TaskCore";

export default function SortableTaskItem({ bulletTask }: { bulletTask: TaskCore }) {
  // 편집 중에는 정렬 드래그를 끈다 — input 포인터 조작이 드래그를 깨워 행이 흐려지는 것을 방지
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bulletTask.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem bulletTask={bulletTask} onEditingChange={setIsEditing} />
    </div>
  );
}
