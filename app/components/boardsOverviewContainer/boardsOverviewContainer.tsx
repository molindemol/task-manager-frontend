import { API_URL } from "@constants/API"
import { useQuery } from "@tanstack/react-query";
import { BoardOverviewCard } from "./boardOverviewCard/boardOverviewCard";
import type { Board } from "@/types/board";

async function fetchAllBoards(){
    let res = await fetch(`${API_URL}/Board`,{
        method: 'GET',
    });
    let jsonData = await res.json();

    return jsonData;
}

export default function BoardsOverviewContainer(){
    const {data : boards , isLoading , isError} = useQuery({queryKey: ["allBoards"], queryFn: fetchAllBoards})
    return (
        <section className="container h-5/6 w-5/6 bg-sky-100 shadow-2xl rounded-2xl p-5 grid grid-cols-4 grid-rows-4 gap-4">
            {!isLoading && boards.map((board : Board) => (
                <BoardOverviewCard board={board} />
            ))}
        </section>
    )
}