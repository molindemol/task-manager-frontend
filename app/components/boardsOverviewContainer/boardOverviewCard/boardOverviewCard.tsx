import { Link } from "react-router";
import type { Board } from "@/types/board";

export interface BoardOverviewCardProps {
    board: Board;
}

export function BoardOverviewCard({ board }: BoardOverviewCardProps) {
    const { id, name, description, createdAt } = board;
    const createdAtString = new Date(createdAt);
    return (
        <Link
            to={`/board/${id}`}
            className="bg-mist-50 grow shadow-md rounded-2xl text-left p-4 hover:scale-105 transition flex flex-col justify-between cursor-pointer"
        >
            <div className="flex flex-col">
                <h1 className="font-bold">{name}</h1>
                <span className="text-sm">{description}</span>
            </div>

            <span className="self-end text-sm">{createdAtString.toLocaleDateString()}</span>
        </Link>
    );
}
