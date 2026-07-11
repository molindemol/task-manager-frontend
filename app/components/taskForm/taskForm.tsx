import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import type { Column, Task } from "@/types/board";
import { useCreateTask, useDeleteTask, useUpdateTask, type TaskInput } from "@/api/tasks";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"] as const;

type Props = {
    boardId: number,
    columns: Column[],
    defaultColumnId: number,
    task?: Task,
    onClose: () => void,
};

export function TaskForm({ boardId, columns, defaultColumnId, task, onClose }: Props) {
    const isEdit = task !== undefined;
    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [status, setStatus] = useState<string>(task?.status ?? STATUS_OPTIONS[0]);
    const [columnId, setColumnId] = useState<number>(task?.columnId ?? defaultColumnId);

    const createTask = useCreateTask(boardId);
    const updateTask = useUpdateTask(boardId);
    const deleteTask = useDeleteTask(boardId);

    const isPending = createTask.isPending || updateTask.isPending || deleteTask.isPending;
    const isError = createTask.isError || updateTask.isError || deleteTask.isError;

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const targetColumn = columns.find((c) => c.id === columnId);
        const keepsColumn = isEdit && task.columnId === columnId;
        const position = keepsColumn ? task.position : targetColumn?.tasks.length ?? 0;
        const input: TaskInput = { title, description, status, position, columnId };
        if (isEdit) {
            updateTask.mutate({ id: task.id, input }, { onSuccess: onClose });
        } else {
            createTask.mutate(input, { onSuccess: onClose });
        }
    }

    function handleDelete() {
        if (!isEdit) return;
        deleteTask.mutate(task.id, { onSuccess: onClose });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-6 flex flex-col gap-4 rounded-2xl bg-mist-50 shadow-2xl"
        >
            <h2 className="text-lg font-bold text-slate-800">{isEdit ? "Edit task" : "New task"}</h2>

            <label className="flex flex-col gap-1 text-sm text-slate-600">
                Title
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    className="shadow-sm p-2 rounded-xl bg-white"
                    placeholder="Write the migration guide"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-600">
                Description
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    rows={3}
                    className="shadow-sm p-2 rounded-xl bg-white resize-none"
                    placeholder="Optional details"
                />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm text-slate-600">
                    Status
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        name="status"
                        className="shadow-sm p-2 rounded-xl bg-white"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1 text-sm text-slate-600">
                    Column
                    <select
                        value={columnId}
                        onChange={(e) => setColumnId(Number(e.target.value))}
                        name="columnId"
                        className="shadow-sm p-2 rounded-xl bg-white"
                    >
                        {columns.map((column) => (
                            <option key={column.id} value={column.id}>{column.name}</option>
                        ))}
                    </select>
                </label>
            </div>

            {isError && (
                <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
                {isEdit ? (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex items-center gap-2 text-red-600 hover:text-red-500 disabled:text-gray-400 text-sm cursor-pointer"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </button>
                ) : (
                    <span />
                )}

                <button
                    type="submit"
                    disabled={!title || isPending}
                    className="shadow px-6 py-2 text-mist-50 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isPending ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}
