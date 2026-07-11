import { GripVertical, Plus, Trash2 } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Column, Task } from "@/types/board";
import { useDeleteColumn } from "@/api/columns";
import { SortableTask } from "@components/sortableTask/sortableTask";
import { TaskCard } from "@components/taskCard/taskCard";

type Props = {
    column: Column,
    boardId: number,
    onAddTask: (columnId: number) => void,
    onEditTask: (task: Task) => void,
    dragHandleProps?: Record<string, unknown>,
    isOverlay?: boolean,
};

export function ColumnComponent({ column, boardId, onAddTask, onEditTask, dragHandleProps, isOverlay }: Props) {
    const deleteColumn = useDeleteColumn(boardId);
    const taskIds = column.tasks.map((t) => `task:${t.id}`);

    function handleDeleteColumn() {
        const confirmed = window.confirm(`Delete column "${column.name}" and its tasks?`);
        if (confirmed) {
            deleteColumn.mutate(column.id);
        }
    }

    return (
        <section className="bg-sky-100 rounded-2xl p-3 w-72 shrink-0 flex flex-col gap-3 max-h-full">
            <header className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    {!isOverlay && (
                        <button
                            type="button"
                            {...dragHandleProps}
                            aria-label={`Reorder column ${column.name}`}
                            className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing touch-none"
                        >
                            <GripVertical className="size-4" />
                        </button>
                    )}
                    <h2 className="font-bold text-slate-700">{column.name}</h2>
                    <span className="text-xs text-slate-500 bg-mist-50 rounded-full px-2 py-0.5">
                        {column.tasks.length}
                    </span>
                </div>
                {!isOverlay && (
                    <button
                        type="button"
                        onClick={handleDeleteColumn}
                        disabled={deleteColumn.isPending}
                        aria-label={`Delete column ${column.name}`}
                        className="text-slate-400 hover:text-red-500 disabled:text-gray-300 transition cursor-pointer"
                    >
                        <Trash2 className="size-4" />
                    </button>
                )}
            </header>

            <div className="flex flex-col gap-2 overflow-y-auto min-h-2">
                {isOverlay ? (
                    column.tasks.map((task) => <TaskCard key={task.id} task={task} onSelect={() => {}} />)
                ) : (
                    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                        {column.tasks.map((task) => (
                            <SortableTask key={task.id} task={task} onSelect={onEditTask} />
                        ))}
                    </SortableContext>
                )}
            </div>

            {!isOverlay && (
                <button
                    type="button"
                    onClick={() => onAddTask(column.id)}
                    className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-800 border-2 border-dashed border-sky-300 hover:border-sky-400 rounded-xl py-2 transition cursor-pointer"
                >
                    <Plus className="size-4" />
                    Add task
                </button>
            )}
        </section>
    );
}
