import { useState } from "react";
import { useBoards } from "@/api/boards";
import type { Board } from "@/types/board";
import { BoardOverviewCard } from "./boardOverviewCard/boardOverviewCard";
import { PlaceholderCard } from "../placeholderCard/placeholderCard";
import AddCard from "../addCard/addCard";
import Modal from "../modal/modal";
import BoardAddForm from "./boardAddForm/boardAddForm";
import DeleteBoardDialog from "./deleteBoardDialog/deleteBoardDialog";

export default function BoardsOverviewContainer() {
    const { data: boards, isLoading, isError, isSuccess } = useBoards();
    const [isAddShow, setIsAddShow] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

    const count = boards?.length ?? 0;
    const countLabel = count === 1 ? "1 board" : `${count} boards`;

    return (
        <div className="w-full max-w-6xl">
            <header className="mb-8 flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Workspace</span>
                <div className="flex items-end justify-between gap-4">
                    <h1 className="font-display text-4xl font-bold text-slate-900">Boards</h1>
                    {isSuccess && <span className="pb-1 text-sm text-slate-400">{countLabel}</span>}
                </div>
            </header>

            <section className="grid grid-cols-1 auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isError && (
                    <p className="col-span-full rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
                        Could not load boards. Is the API running?
                    </p>
                )}

                {isSuccess && boards.map((board) => (
                    <BoardOverviewCard key={board.id} board={board} onDelete={setBoardToDelete} />
                ))}

                {isLoading && [...Array(4)].map((_, index) => (<PlaceholderCard key={index} />))}

                {!isError && <AddCard setIsBool={setIsAddShow} isBool={isAddShow} />}
            </section>

            {isAddShow && (
                <Modal onClose={() => setIsAddShow(false)}>
                    <BoardAddForm onSuccess={() => setIsAddShow(false)} />
                </Modal>
            )}

            {boardToDelete && (
                <Modal onClose={() => setBoardToDelete(null)}>
                    <DeleteBoardDialog board={boardToDelete} onClose={() => setBoardToDelete(null)} />
                </Modal>
            )}
        </div>
    );
}
