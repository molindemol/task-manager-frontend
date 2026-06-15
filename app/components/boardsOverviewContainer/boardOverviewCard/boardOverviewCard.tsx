import type { Board } from "@/types/board";


export interface BoardOverviewCardProps {
    board : Board;
}

export function BoardOverviewCard(prop : BoardOverviewCardProps){
    const { board } = prop;
    const { id, name, description, createdAt } = board;
    const createdAtString = new Date(createdAt);
    return (
        <div className={"bg-mist-50 shadow-md rounded-2xl p-4 hover:scale-105 transition flex flex-col justify-between"}>
            <h1 className="font-bold">{name}</h1>
            <span className="text-sm">{description}</span>
            <span className="self-end">{createdAtString.toLocaleDateString()}</span>
        </div>
    )
}