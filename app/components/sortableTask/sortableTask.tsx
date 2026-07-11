import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types/board";
import { TaskCard } from "@components/taskCard/taskCard";

type Props = {
    task: Task,
    onSelect: (task: Task) => void,
};

export function SortableTask({ task, onSelect }: Props) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: `task:${task.id}`,
        data: { type: "task", task },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <TaskCard task={task} onSelect={onSelect} />
        </div>
    );
}
