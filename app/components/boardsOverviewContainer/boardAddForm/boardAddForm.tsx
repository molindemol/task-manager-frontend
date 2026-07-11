import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCreateBoard, type CreateBoardInput } from "@/api/boards";

type Props = {
    onSuccess: () => void,
};

export default function BoardAddForm({ onSuccess }: Props) {
    const [inputs, setInputs] = useState<CreateBoardInput>({ name: "", description: "" });
    const mutation = useCreateBoard();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutation.mutate(inputs, { onSuccess });
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl p-6 flex flex-col gap-4 rounded-2xl bg-mist-50 shadow-2xl">
            <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-600">
                    Name
                </label>
                <input onChange={handleChange} value={inputs.name} name="name" className="shadow-sm p-2 rounded-xl bg-white" placeholder="Make a kanban board." />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-600">
                    Description
                </label>
                <textarea onChange={handleChange} value={inputs.description} name="description" rows={4} className="shadow-sm p-2 rounded-xl bg-white resize-none" placeholder="Make a kanban board that can show multiple boards, columns and tasks." />
            </div>

            {mutation.isError && <div className="text-red-600 text-sm">Error creating board. Please try again.</div>}

            <button disabled={!inputs.name || !inputs.description || mutation.isPending} className={`shadow py-3 px-4 text-mist-50 rounded-xl ${mutation.isError ? 'bg-red-500 hover:bg-red-400' : 'bg-sky-500 hover:bg-sky-400'} disabled:bg-gray-400 disabled:cursor-not-allowed`}>
                {mutation.isPending ? 'Creating...' : 'Create'}
            </button>
        </form>
    );
}
