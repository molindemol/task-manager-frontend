import { Link } from "react-router";
import { ArrowUpRight, Trash2 } from "lucide-react";
import type { Board } from "@/types/board";

export interface BoardOverviewCardProps {
    board: Board;
    onDelete: (board: Board) => void;
}

/**
 * Each board gets a stable accent hue derived from its id, so a board keeps the
 * same colour every visit and is easy to pick out at a glance.
 */
function accentHue(id: number): number {
    return (id * 47) % 360;
}

export function BoardOverviewCard({ board, onDelete }: BoardOverviewCardProps) {
    const { id, name, description, createdAt } = board;
    const hue = accentHue(id);
    const spine = `hsl(${hue} 70% 55%)`;
    const createdAtLabel = new Date(createdAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        onDelete(board);
    }

    return (
        <div className="group relative flex min-h-40 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: spine }} />

            <Link
                to={`/board/${id}`}
                aria-label={`Open board ${name}`}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            />

            <button
                type="button"
                onClick={handleDelete}
                aria-label={`Delete board ${name}`}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100"
            >
                <Trash2 size={16} />
            </button>

            <div className="flex flex-1 flex-col gap-1.5 pl-2 pr-6">
                <h2 className="font-display text-base font-semibold leading-snug text-slate-900">{name}</h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-500">{description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between pl-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{createdAtLabel}</span>
                <ArrowUpRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500"
                />
            </div>
        </div>
    );
}
