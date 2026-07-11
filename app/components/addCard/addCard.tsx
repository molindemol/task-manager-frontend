import { type Dispatch, type SetStateAction } from "react"
import { Plus } from "lucide-react"

interface AddCardProps {
    isBool: boolean,
    setIsBool: Dispatch<SetStateAction<boolean>>
}

export default function AddCard({ isBool, setIsBool }: AddCardProps) {
    return (
        <button
            type="button"
            onClick={() => setIsBool(!isBool)}
            className="group flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/40 text-slate-400 transition hover:border-sky-400 hover:bg-sky-50/60 hover:text-sky-600"
        >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current transition group-hover:scale-110">
                <Plus size={22} />
            </span>
            <span className="text-sm font-medium">New board</span>
        </button>
    )
}
