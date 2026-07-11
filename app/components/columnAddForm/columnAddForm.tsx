import { useState, type FormEvent } from "react";
import { useCreateColumn } from "@/api/columns";

type Props = {
    boardId: number,
    position: number,
    onClose: () => void,
};

export function ColumnAddForm({ boardId, position, onClose }: Props) {
    const [name, setName] = useState("");
    const createColumn = useCreateColumn(boardId);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        createColumn.mutate({ name, position, boardId }, { onSuccess: onClose });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="container max-w-md p-6 flex flex-col gap-4 rounded-2xl bg-mist-50 shadow-2xl"
        >
            <h2 className="text-lg font-bold text-slate-800">New column</h2>

            <label className="flex flex-col gap-1 text-sm text-slate-600">
                Name
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    className="shadow-sm p-2 rounded-xl bg-white"
                    placeholder="To Do"
                />
            </label>

            {createColumn.isError && (
                <p className="text-red-600 text-sm">Could not create the column. Please try again.</p>
            )}

            <button
                type="submit"
                disabled={!name || createColumn.isPending}
                className="shadow px-6 py-2 text-mist-50 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
                {createColumn.isPending ? "Creating..." : "Create"}
            </button>
        </form>
    );
}
