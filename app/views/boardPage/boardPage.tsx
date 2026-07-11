import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { Column, Task } from "@/types/board";
import { boardKeys, useBoard } from "@/api/boards";
import { apiFetch } from "@/api/client";
import Modal from "@components/modal/modal";
import { ColumnComponent } from "@components/columnComponent/columnComponent";
import { SortableColumn } from "@components/sortableColumn/sortableColumn";
import { TaskCard } from "@components/taskCard/taskCard";
import { TaskForm } from "@components/taskForm/taskForm";
import { ColumnAddForm } from "@components/columnAddForm/columnAddForm";

type ModalState =
    | { type: "addColumn" }
    | { type: "addTask", columnId: number }
    | { type: "editTask", task: Task }
    | null;

const idNum = (prefixed: string) => Number(prefixed.split(":")[1]);

export function BoardPage() {
    const params = useParams();
    const boardId = Number(params.id);
    const { data: board, isLoading, isError } = useBoard(boardId);
    const queryClient = useQueryClient();

    const [columns, setColumns] = useState<Column[]>([]);
    const [modal, setModal] = useState<ModalState>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [sourceColumnId, setSourceColumnId] = useState<number | null>(null);

    useEffect(() => {
        if (board) setColumns(board.columns);
    }, [board]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    if (isLoading) {
        return (
            <main className="w-full h-screen flex items-center justify-center text-slate-500">
                Loading board...
            </main>
        );
    }

    if (isError || !board) {
        return (
            <main className="w-full h-screen flex flex-col gap-4 items-center justify-center text-slate-600 p-4 text-center">
                <p>Could not load this board.</p>
                <Link to="/" className="text-sky-600 hover:text-sky-500 flex items-center gap-2">
                    <ArrowLeft className="size-4" />
                    Back to boards
                </Link>
            </main>
        );
    }

    const closeModal = () => setModal(null);

    function columnIdOf(id: string): number | null {
        if (id.startsWith("col:")) return idNum(id);
        const taskId = idNum(id);
        const column = columns.find((c) => c.tasks.some((t) => t.id === taskId));
        return column ? column.id : null;
    }

    async function persistTasks(cols: Column[], affectedIds: number[]) {
        const requests: Promise<unknown>[] = [];
        for (const column of cols) {
            if (!affectedIds.includes(column.id)) continue;
            column.tasks.forEach((task, index) => {
                requests.push(
                    apiFetch<void>(`/Task/${task.id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            title: task.title,
                            description: task.description,
                            status: task.status,
                            position: index,
                            columnId: column.id,
                        }),
                    }),
                );
            });
        }
        try {
            await Promise.all(requests);
        } finally {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
        }
    }

    async function persistColumns(cols: Column[]) {
        const requests = cols.map((column, index) =>
            apiFetch<void>(`/Column/${column.id}`, {
                method: "PUT",
                body: JSON.stringify({ name: column.name, position: index }),
            }),
        );
        try {
            await Promise.all(requests);
        } finally {
            queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
        }
    }

    function handleDragStart(event: DragStartEvent) {
        const type = event.active.data.current?.type;
        if (type === "task") {
            const task = event.active.data.current?.task as Task;
            setActiveTask(task);
            setSourceColumnId(task.columnId);
        }
        if (type === "column") {
            setActiveColumn(event.active.data.current?.column as Column);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
        if (active.data.current?.type !== "task") return;

        const activeColId = columnIdOf(String(active.id));
        const overColId = columnIdOf(String(over.id));
        if (activeColId === null || overColId === null || activeColId === overColId) return;

        setColumns((prev) => {
            const activeCol = prev.find((c) => c.id === activeColId);
            const overCol = prev.find((c) => c.id === overColId);
            if (!activeCol || !overCol) return prev;

            const activeTaskId = idNum(String(active.id));
            const moving = activeCol.tasks.find((t) => t.id === activeTaskId);
            if (!moving) return prev;

            const remaining = activeCol.tasks.filter((t) => t.id !== activeTaskId);
            let insertIndex = overCol.tasks.length;
            if (String(over.id).startsWith("task:")) {
                const overIndex = overCol.tasks.findIndex((t) => t.id === idNum(String(over.id)));
                if (overIndex >= 0) insertIndex = overIndex;
            }
            const movedTask = { ...moving, columnId: overColId };
            const nextOverTasks = [
                ...overCol.tasks.slice(0, insertIndex),
                movedTask,
                ...overCol.tasks.slice(insertIndex),
            ];

            return prev.map((c) => {
                if (c.id === activeColId) return { ...c, tasks: remaining };
                if (c.id === overColId) return { ...c, tasks: nextOverTasks };
                return c;
            });
        });
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const type = active.data.current?.type;
        const startColumnId = sourceColumnId;
        setActiveTask(null);
        setActiveColumn(null);
        setSourceColumnId(null);
        if (!over) return;

        if (type === "column") {
            const activeColId = idNum(String(active.id));
            const overColId = columnIdOf(String(over.id));
            if (overColId === null || activeColId === overColId) return;
            const oldIndex = columns.findIndex((c) => c.id === activeColId);
            const newIndex = columns.findIndex((c) => c.id === overColId);
            if (oldIndex < 0 || newIndex < 0) return;
            const reordered = arrayMove(columns, oldIndex, newIndex);
            setColumns(reordered);
            await persistColumns(reordered);
            return;
        }

        if (type === "task") {
            const activeColId = columnIdOf(String(active.id));
            if (activeColId === null) return;
            const activeTaskId = idNum(String(active.id));

            let nextColumns = columns;
            const column = columns.find((c) => c.id === activeColId);
            if (column) {
                const oldIndex = column.tasks.findIndex((t) => t.id === activeTaskId);
                let newIndex = oldIndex;
                if (String(over.id).startsWith("task:")) {
                    const overIndex = column.tasks.findIndex((t) => t.id === idNum(String(over.id)));
                    if (overIndex >= 0) newIndex = overIndex;
                }
                if (oldIndex !== newIndex && oldIndex >= 0) {
                    const reorderedTasks = arrayMove(column.tasks, oldIndex, newIndex);
                    nextColumns = columns.map((c) => (c.id === activeColId ? { ...c, tasks: reorderedTasks } : c));
                    setColumns(nextColumns);
                }
            }

            const affected = [activeColId];
            if (startColumnId !== null && startColumnId !== activeColId) affected.push(startColumnId);
            await persistTasks(nextColumns, affected);
        }
    }

    return (
        <main className="w-full h-screen flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden">
            <header className="flex flex-col gap-1">
                <Link to="/" className="text-sm text-sky-600 hover:text-sky-500 flex items-center gap-2 w-fit">
                    <ArrowLeft className="size-4" />
                    Back to boards
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{board.name}</h1>
                {board.description && <p className="text-sm sm:text-base text-slate-500">{board.description}</p>}
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 items-start overflow-x-auto flex-1 min-h-0 pb-2">
                    <SortableContext
                        items={columns.map((c) => `col:${c.id}`)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column) => (
                            <SortableColumn
                                key={column.id}
                                column={column}
                                boardId={boardId}
                                onAddTask={(columnId) => setModal({ type: "addTask", columnId })}
                                onEditTask={(task) => setModal({ type: "editTask", task })}
                            />
                        ))}
                    </SortableContext>

                    <button
                        type="button"
                        onClick={() => setModal({ type: "addColumn" })}
                        className="w-72 shrink-0 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl py-3 transition cursor-pointer"
                    >
                        <Plus className="size-5" />
                        Add column
                    </button>
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <TaskCard task={activeTask} onSelect={() => {}} />
                    ) : activeColumn ? (
                        <ColumnComponent
                            column={activeColumn}
                            boardId={boardId}
                            onAddTask={() => {}}
                            onEditTask={() => {}}
                            isOverlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {modal && (
                <Modal onClose={closeModal}>
                    {modal.type === "addColumn" && (
                        <ColumnAddForm boardId={boardId} position={columns.length} onClose={closeModal} />
                    )}
                    {modal.type === "addTask" && (
                        <TaskForm
                            boardId={boardId}
                            columns={columns}
                            defaultColumnId={modal.columnId}
                            onClose={closeModal}
                        />
                    )}
                    {modal.type === "editTask" && (
                        <TaskForm
                            boardId={boardId}
                            columns={columns}
                            defaultColumnId={modal.task.columnId ?? columns[0]?.id ?? 0}
                            task={modal.task}
                            onClose={closeModal}
                        />
                    )}
                </Modal>
            )}
        </main>
    );
}
