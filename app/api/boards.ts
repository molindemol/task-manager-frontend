import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Board, BoardDetail } from "@/types/board";

export const boardKeys = {
    all: ["boards"] as const,
    detail: (id: number) => ["board", id] as const,
};

export type CreateBoardInput = {
    name: string,
    description: string,
};

export function useBoards() {
    return useQuery({
        queryKey: boardKeys.all,
        queryFn: () => apiFetch<Board[]>("/Board"),
    });
}

export function useBoard(id: number) {
    return useQuery({
        queryKey: boardKeys.detail(id),
        queryFn: () => apiFetch<BoardDetail>(`/Board/${id}`),
        enabled: Number.isFinite(id),
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateBoardInput) =>
            apiFetch<Board>("/Board", { method: "POST", body: JSON.stringify(input) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.all }),
    });
}
