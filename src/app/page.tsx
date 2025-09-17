import Hello from "@/components/Hello"


export default function Home() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Главная</h1>
            <Hello name="Владимир" />
        </div>
    )
}