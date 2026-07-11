import { AlertTriangle } from "lucide-react";
import { useDeleteBoard } from "@/api/boards";
import type { Board } from "@/types/board";

type Props = {
    board: Board,
    onClose: () => void,
};

export default function DeleteBoardDialog({ board, onClose }: Props) {
    const mutation = useDeleteBoard();

    function handleDelete() {
        mutation.mutate(board.id, { onSuccess: onClose });
    }

    return (
        <div className="w-full max-w-md p-6 flex flex-col gap-5 rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <AlertTriangle size={20} />
                </span>
                <div className="flex flex-col gap-1">
                    <h2 className="font-display text-lg font-semibold text-slate-900">Delete this board?</h2>
                    <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">{board.name}</span> and all of its columns and tasks are removed. This cannot be undone.
                    </p>
                </div>
            </div>

            {mutation.isError && (
                <p className="text-sm text-red-600">Could not delete the board. Please try again.</p>
            )}

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={mutation.isPending}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={mutation.isPending}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {mutation.isPending ? "Deleting..." : "Delete board"}
                </button>
            </div>
        </div>
    );
}
