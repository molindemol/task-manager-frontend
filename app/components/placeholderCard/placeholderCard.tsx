export function PlaceholderCard() {
    return (
        <div className="flex min-h-40 flex-col justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2">
                <span className="h-5 w-1/2 animate-pulse rounded-lg bg-mist-200" />
                <span className="h-4 w-4/5 animate-pulse rounded-lg bg-mist-100" />
                <span className="h-4 w-2/3 animate-pulse rounded-lg bg-mist-100" />
            </div>
            <span className="h-3 w-1/3 animate-pulse rounded-lg bg-mist-100" />
        </div>
    )
}
