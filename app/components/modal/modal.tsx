import type { Dispatch, ReactNode, SetStateAction } from "react"

interface ModalProps {
    setIsModalShow: Dispatch<SetStateAction<boolean>>,
    children: ReactNode
}

export default function Modal(props: ModalProps){
    const { setIsModalShow, children } = props;
    return (
        <section className="h-screen w-screen fixed flex justify-center items-center">
            <span onClick={() => setIsModalShow(false)} className="w-full h-full -z-50 fixed bg-black opacity-45" />
            {children}
        </section>
    )
}