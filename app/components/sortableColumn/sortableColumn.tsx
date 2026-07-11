import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Column, Task } from "@/types/board";
import { ColumnComponent } from "@components/columnComponent/columnComponent";

type Props = {
    column: Column,
    boardId: number,
    onAddTask: (columnId: number) => void,
    onEditTask: (task: Task) => void,
};

export function SortableColumn({ column, boardId, onAddTask, onEditTask }: Props) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: `col:${column.id}`,
        data: { type: "column", column },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <ColumnComponent
                column={column}
                boardId={boardId}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}
