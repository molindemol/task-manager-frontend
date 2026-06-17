import { type Dispatch, type SetStateAction } from "react"

interface AddCardProps {
    isBool: boolean,
    setIsBool: Dispatch<SetStateAction<boolean>>
}

export default function AddCard(props : AddCardProps){
    const { isBool, setIsBool } = props;
    return (
        <button onClick={() => setIsBool(!isBool)} className={"border-mist-50 m-10 mx-15 border-4 border-dashed shadow-md rounded-2xl hover:scale-105 transition p-4 pb-6 flex justify-center items-center cursor-pointer"}>
            <span className="text-6xl">+</span>
        </button>
    )
}