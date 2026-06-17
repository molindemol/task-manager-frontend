import type { Board } from "@/types/board";


export interface BoardOverviewCardProps {
    board : Board;
}

export function BoardOverviewCard(prop : BoardOverviewCardProps){
    const { board } = prop;
    const { id, name, description, createdAt } = board;
    const createdAtString = new Date(createdAt);
    return (
        <button className={"bg-mist-50 shadow-md rounded-2xl text-left p-4 hover:scale-105 transition flex flex-col justify-between cursor-pointer"}>
            <div className="flex flex-col">
                <h1 className="font-bold">{name}</h1>
                <span className="text-sm">{description}</span>
            </div>
            
            <span className="self-end text-sm">{createdAtString.toLocaleDateString()}</span>
        </button>
    )
}