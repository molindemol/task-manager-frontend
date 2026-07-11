import type { Task } from "@/types/board";

const STATUS_STYLES: Record<string, string> = {
    "To Do": "bg-mist-200 text-slate-700",
    "In Progress": "bg-amber-100 text-amber-800",
    "Done": "bg-emerald-100 text-emerald-800",
};

type Props = {
    task: Task,
    onSelect: (task: Task) => void,
};

export function TaskCard({ task, onSelect }: Props) {
    const statusStyle = STATUS_STYLES[task.status] ?? "bg-mist-200 text-slate-700";
    return (
        <button
            type="button"
            onClick={() => onSelect(task)}
            className="bg-mist-50 w-full text-left shadow-sm rounded-xl p-3 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
        >
            <span className="font-semibold text-slate-800">{task.title}</span>
            {task.description && (
                <span className="text-sm text-slate-500 line-clamp-3">{task.description}</span>
            )}
            {task.status && (
                <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                    {task.status}
                </span>
            )}
        </button>
    );
}
