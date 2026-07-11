export type Task = {
    id: number,
    title: string,
    description: string,
    status: string,
    position: number,
    columnId: number | null,
}

export type Column = {
    id: number,
    name: string,
    position: number,
    boardId: number,
    tasks: Task[],
}

export type Board = {
    id: number,
    name: string,
    description: string,
    createdAt: string,
}

export type BoardDetail = Board & {
    columns: Column[],
}
