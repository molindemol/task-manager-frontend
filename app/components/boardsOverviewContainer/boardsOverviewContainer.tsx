import { API_URL } from "@constants/API"
import { useQuery } from "@tanstack/react-query";
import { BoardOverviewCard } from "./boardOverviewCard/boardOverviewCard";
import type { Board } from "@/types/board";
import { PlaceholderCard } from "../placeholderCard/placeholderCard";
import AddCard from "../addCard/addCard";
import { useState } from "react";
import Modal from "../modal/modal";
import BoardAddForm from "./boardAddForm/boardAddForm";

async function fetchAllBoards(){
    let res = await fetch(`${API_URL}/Board`,{
        method: 'GET',
    });
    let jsonData = await res.json();

    return jsonData;
}

export default function BoardsOverviewContainer(){
    const {data : boards , isLoading, isError, isSuccess } = useQuery({queryKey: ["allBoards"], queryFn: fetchAllBoards})
    const [isModalShow, setIsModalShow] = useState(false);
    return (
    <>
        <section className="container h-5/6 bg-sky-100 shadow-2xl rounded-2xl p-5 flex flex-col lg:grid lg:grid-cols-4 lg:grid-rows-4 gap-4">
            {!isLoading && !isError && isSuccess && boards.map((board : Board) => (
                <BoardOverviewCard key={board.id} board={board} />
            ))}
            
            {isLoading && [...Array(4)].map(() => (<PlaceholderCard />)) }
            <AddCard setIsBool={setIsModalShow} isBool={isModalShow} />
        </section>
        {isModalShow && 
            <Modal setIsModalShow={setIsModalShow} >
                <BoardAddForm />
            </Modal>
        }
        
    </>
        
    )
}