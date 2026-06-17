export function PlaceholderCard(){
    return (
        <div className={"bg-mist-50 shadow-md rounded-2xl p-4 flex flex-col justify-between animate-pulse"}>
            <div className="flex flex-col gap-2">
                <span className="animate-pulse rounded-lg bg-mist-200 h-5 w-1/2" />
                <span className="animate-pulse rounded-lg bg-mist-100 h-8 w-1/2" />
            </div>
            <span className=" self-end animate-pulse rounded-lg bg-mist-100 h-4 w-1/2" />
        </div>
    )
}