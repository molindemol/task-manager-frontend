import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { boardKeys } from "./boards";
import type { Column } from "@/types/board";

export type CreateColumnInput = {
    name: string,
    position: number,
    boardId: number,
};

export function useCreateColumn(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateColumnInput) =>
            apiFetch<Column>("/Column", { method: "POST", body: JSON.stringify(input) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) }),
    });
}

export function useDeleteColumn(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiFetch<void>(`/Column/${id}`, { method: "DELETE" }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) }),
    });
}
