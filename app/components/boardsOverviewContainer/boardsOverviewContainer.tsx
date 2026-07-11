import { useState } from "react";
import { useBoards } from "@/api/boards";
import { BoardOverviewCard } from "./boardOverviewCard/boardOverviewCard";
import { PlaceholderCard } from "../placeholderCard/placeholderCard";
import AddCard from "../addCard/addCard";
import Modal from "../modal/modal";
import BoardAddForm from "./boardAddForm/boardAddForm";

export default function BoardsOverviewContainer() {
    const { data: boards, isLoading, isError, isSuccess } = useBoards();
    const [isModalShow, setIsModalShow] = useState(false);

    return (
        <>
            <section className="container h-5/6 bg-sky-100 shadow-2xl rounded-2xl p-5 flex flex-col lg:grid lg:grid-cols-4 lg:grid-rows-4 gap-4">
                {isError && (
                    <p className="col-span-4 text-red-600">Could not load boards. Is the API running?</p>
                )}

                {isSuccess && boards.map((board) => (
                    <BoardOverviewCard key={board.id} board={board} />
                ))}

                {isLoading && [...Array(4)].map((_, index) => (<PlaceholderCard key={index} />))}

                <AddCard setIsBool={setIsModalShow} isBool={isModalShow} />
            </section>

            {isModalShow &&
                <Modal onClose={() => setIsModalShow(false)}>
                    <BoardAddForm onSuccess={() => setIsModalShow(false)} />
                </Modal>
            }
        </>
    );
}
