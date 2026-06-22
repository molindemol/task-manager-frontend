import { API_URL } from "@/constants/API";
import type { Board } from "@/types/board";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent, type SubmitEvent} from "react";

async function createBoard(board : Board) {
    return fetch(`${API_URL}/Board`,{method: "POST",headers: {"Content-Type": "application/json"}, body: JSON.stringify(board)});
}

export default function BoardAddForm(){
    const [inputs, setInputs] = useState({} as Board);
    const mutation = useMutation({mutationFn: createBoard})

    useEffect(() => {
        if (mutation.isSuccess) {
            window.location.reload();
        }
    }, [mutation.isSuccess]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        mutation.mutate(inputs)
    }
    return (
        <form onSubmit={handleSubmit} className="container p-6 max-w-2xl h-1/2 gap-4 grid grid-rows-3 rounded-2xl bg-mist-50">
            <div className="flex flex-col">
                <label>
                    Name
                </label>
                <input onChange={handleChange} value={inputs.name} name="name" className="shadow p-2 h-full rounded-xl" placeholder="Make a kanban board." /> 
            </div>
            
            <div className="flex flex-col row-span-2">
                <label>
                    Description
                </label>
                <textarea onChange={handleChange} value={inputs.description} name="description" className="shadow p-2 h-full rounded-xl" placeholder="Make a kanban board that can show multiple boards, columns and tasks." />
            </div>
            
            {mutation.isError && <div className="text-red-600 text-sm">Error creating board. Please try again.</div>}
            
            <button disabled={!inputs.name || !inputs.description || mutation.isPending} className={`shadow h-full p-4 text-mist-50 rounded-xl ${mutation.isError ? 'bg-red-500 hover:bg-red-400' : 'bg-sky-500 hover:bg-sky-400'} disabled:bg-gray-400 disabled:cursor-not-allowed`}>
                {mutation.isPending ? 'Creating...' : 'Create'}
            </button>
        </form>
    )
}