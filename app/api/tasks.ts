import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { boardKeys } from "./boards";
import type { Task } from "@/types/board";

/**
 * The API always sends the full task on create and update. The update endpoint
 * marks every scalar column as modified, so a partial payload would wipe the
 * fields left out. Callers must pass the complete task each time.
 */
export type TaskInput = {
    title: string,
    description: string,
    status: string,
    position: number,
    columnId: number,
};

export function useCreateTask(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: TaskInput) =>
            apiFetch<Task>("/Task", { method: "POST", body: JSON.stringify(input) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) }),
    });
}

export function useUpdateTask(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: number, input: TaskInput }) =>
            apiFetch<void>(`/Task/${id}`, { method: "PUT", body: JSON.stringify(input) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) }),
    });
}

export function useDeleteTask(boardId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiFetch<void>(`/Task/${id}`, { method: "DELETE" }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) }),
    });
}
