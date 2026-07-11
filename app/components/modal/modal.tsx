import { useEffect, type ReactNode } from "react"

interface ModalProps {
    onClose: () => void,
    children: ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <section className="h-screen w-screen fixed inset-0 flex justify-center items-center p-4">
            <span onClick={onClose} className="absolute inset-0 bg-black opacity-45" />
            <div className="relative z-10 w-full flex justify-center">{children}</div>
        </section>
    )
}
