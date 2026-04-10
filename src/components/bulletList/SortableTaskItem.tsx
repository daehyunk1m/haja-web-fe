import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "../TaskItem";
import { TaskCore } from "@/shared/TaskCore";

export default function SortableTaskItem({ bulletTask }: { bulletTask: TaskCore }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bulletTask.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem bulletTask={bulletTask} />
    </div>
  );
}
